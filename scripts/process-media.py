"""
Prepares every KUC image for the new site.

Reads media/source/ (downloaded by scripts/fetch-media.mjs) and writes:
  public/media/...      web-ready images (max 1600px wide)
  media/images.json     one entry per original URL: kind, size, focal point

Kinds:
  photo    a normal photograph. Shown in a printed frame, cropped around faces.
  cutout   KUC's flattened circle graphics (photo in a circle with doodles).
           Rebuilt as a rectangular photo: from the raw original when one is
           found in the media library, otherwise the doodle strokes are removed
           and the photo is cropped from inside the circle.
  graphic  logos, icons, infographics, report covers, tiles with text.
           Never cropped; shown whole on a card.

Run: python3 scripts/process-media.py   (needs opencv-python-headless, numpy, pillow)
Overrides for anything classified wrongly go in media/overrides.json.
"""
import json, os, sys, glob
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "media", "source")
OUT = os.path.join(ROOT, "public", "media")
LIB = os.path.join(ROOT, "media", "library")
MAX_W = 1600

faces_front = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
faces_alt = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml")
faces_profile = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")


def load_rgba(path):
    im = Image.open(path)
    im.load()
    return np.array(im.convert("RGBA"))


def background_mask(rgba):
    """True where the pixel is background: transparent, or near white."""
    a = rgba[..., 3]
    rgb = rgba[..., :3].astype(int)
    white = (rgb.min(axis=2) > 238)
    return (a < 40) | white


def _circle(p1, p2, p3):
    ax, ay = p1; bx, by = p2; cx, cy = p3
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    if abs(d) < 1e-6:
        return None
    ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return ux, uy, float(np.hypot(ax - ux, ay - uy))


def find_disc(rgba):
    """If the image is a photo inside a circle on a plain background, return (cx, cy, r).

    Fits a circle to the outline of the shape, ignoring stray points (RANSAC), so
    doodles over the edge and white sky touching the edge don't throw it off.
    """
    h, w = rgba.shape[:2]
    bg = background_mask(rgba)
    e = max(4, min(h, w) // 14)
    corners = [bg[:e, :e].mean(), bg[:e, -e:].mean(), bg[-e:, :e].mean(), bg[-e:, -e:].mean()]
    if sum(c > 0.55 for c in corners) < 3:
        return None
    # Background is only what's connected to the image border.
    n, labels = cv2.connectedComponents(bg.astype(np.uint8))
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    outer = np.isin(labels, list(border)) & bg
    fg = (~outer).astype(np.uint8)
    cnts, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not cnts:
        return None
    pts = max(cnts, key=cv2.contourArea)[:, 0, :].astype(np.float64)
    if len(pts) < 50:
        return None
    rng = np.random.default_rng(1)
    best, best_in = None, 0
    for _ in range(600):
        c = _circle(*pts[rng.choice(len(pts), 3, replace=False)])
        if not c or c[2] < 0.25 * min(h, w) or c[2] > 0.75 * max(h, w):
            continue
        inl = np.abs(np.hypot(pts[:, 0] - c[0], pts[:, 1] - c[1]) - c[2]) < 2.5
        if inl.sum() > best_in:
            best, best_in = c, inl.sum()
    if not best:
        return None
    cx, cy, r = best
    if best_in / (2 * np.pi * r) < 0.45:
        return None
    return (float(cx), float(cy), float(r))


def flatness(rgb):
    """Share of the image made of flat colour. High for graphics, low for photos."""
    small = cv2.resize(rgb, (128, 128), interpolation=cv2.INTER_AREA).astype(np.float32)
    grey = cv2.cvtColor(small, cv2.COLOR_RGB2GRAY)
    mean = cv2.blur(grey, (3, 3))
    sq = cv2.blur(grey * grey, (3, 3))
    std = np.sqrt(np.maximum(sq - mean * mean, 0))
    return float((std < 1.5).mean())


def classify(path, rgba):
    disc = find_disc(rgba)
    if disc:
        cx, cy, r = disc
        s = int(r * 1.3)
        x0, y0 = int(cx - s / 2), int(cy - s / 2)
        core = rgba[max(0, y0):y0 + s, max(0, x0):x0 + s, :3]
        # A flat coloured circle with an icon is a badge, not a photo.
        return ("graphic", None) if flatness(core) > 0.45 else ("cutout", disc)
    rgb = rgba[..., :3]
    has_alpha = (rgba[..., 3] < 200).mean() > 0.05
    flat = flatness(rgb)
    if has_alpha or flat > 0.42:
        return "graphic", None
    return "photo", None


def detect_faces(rgb):
    """Face boxes (x, y, w, h) in the image's own pixels."""
    h, w = rgb.shape[:2]
    scale = 900 / max(h, w) if max(h, w) > 900 else 1
    g = cv2.cvtColor(cv2.resize(rgb, None, fx=scale, fy=scale) if scale < 1 else rgb, cv2.COLOR_RGB2GRAY)
    g = cv2.equalizeHist(g)
    m = int(min(g.shape) * 0.06)
    boxes = []
    # Strict settings: a missed face falls back to a safe upper-middle crop,
    # but a false one (a window, a leaf) would pull the crop somewhere odd.
    for det, n in ((faces_front, 9), (faces_alt, 7)):
        for b in det.detectMultiScale(g, scaleFactor=1.1, minNeighbors=n, minSize=(m, m)):
            boxes.append([v / scale for v in b])
    # Merge overlapping boxes.
    out = []
    for b in sorted(boxes, key=lambda b: -b[2] * b[3]):
        if not any(abs(b[0] - o[0]) < o[2] * 0.5 and abs(b[1] - o[1]) < o[3] * 0.5 for o in out):
            out.append(b)
    return out


def focal_point(rgb):
    """Where to keep in frame when the image is cropped, as fractions (x, y).

    Centres on the faces, nudged up a little so heads keep their headroom.
    Without faces, the upper middle: subjects usually sit above centre.
    """
    h, w = rgb.shape[:2]
    faces = detect_faces(rgb)
    if not faces:
        return 0.5, 0.42, 0
    x0 = min(f[0] for f in faces); x1 = max(f[0] + f[2] for f in faces)
    y0 = min(f[1] for f in faces); y1 = max(f[1] + f[3] for f in faces)
    fx = (x0 + x1) / 2 / w
    fy = max(0.0, (y0 + (y1 - y0) * 0.35) / h)
    return round(min(max(fx, 0.05), 0.95), 3), round(min(max(fy, 0.05), 0.95), 3), len(faces)


def remove_doodles(rgb, disc):
    """Paints out the black doodle strokes KUC draws over the edge of its circle graphics."""
    h, w = rgb.shape[:2]
    cx, cy, r = disc
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.hypot(xx - cx, yy - cy)
    # Doodles are pure black; photo shadows rarely are.
    dark = (rgb.max(axis=2) < 38).astype(np.uint8)
    n, labels = cv2.connectedComponents(dark, connectivity=8)
    seeds = np.unique(labels[(dark > 0) & (d > r * 1.01)])
    mask = (np.isin(labels, seeds[seeds > 0]) & (d > r * 0.35)).astype(np.uint8)
    # Keep strokes only: drop any part of the shape too thick to be a pen line
    # (dark hair or clothing that happens to touch a doodle).
    k = max(9, int(r * 0.06)) | 1
    thick = cv2.morphologyEx(mask, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    thick_outside = thick & (d > r * 1.01)
    keep_thick = cv2.dilate(thick_outside, np.ones((3, 3), np.uint8), iterations=int(r * 0.15))
    mask = (mask & ~(thick & ~keep_thick)) * 255
    mask = cv2.dilate(mask.astype(np.uint8), np.ones((5, 5), np.uint8))
    return cv2.inpaint(rgb, mask, 6, cv2.INPAINT_TELEA), int((mask > 0).sum())


def save(img, rel, kind):
    """Writes a web-ready copy under public/media and returns its public path and size."""
    stem = os.path.splitext(rel)[0]
    im = Image.fromarray(img)
    limit = 1200 if kind == "graphic" else MAX_W
    if im.width > limit:
        im = im.resize((limit, round(im.height * limit / im.width)), Image.LANCZOS)
    if kind == "graphic" and im.mode == "RGBA":
        out = os.path.join(OUT, stem + ".png"); os.makedirs(os.path.dirname(out), exist_ok=True)
        im.save(out, optimize=True)
    else:
        out = os.path.join(OUT, stem + ".jpg"); os.makedirs(os.path.dirname(out), exist_ok=True)
        im.convert("RGB").save(out, quality=82, optimize=True, progressive=True)
    return "/" + os.path.relpath(out, os.path.join(ROOT, "public")).replace(os.sep, "/"), im.width, im.height


def blob_regions(rgba):
    """The photo regions of a composite graphic, largest first, as (mask, bbox)."""
    fg = (~background_mask(rgba)).astype(np.uint8)
    # Thin doodle strokes vanish with an opening; the photo blobs stay.
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg)
    out = []
    for i in range(1, n):
        if stats[i][4] <= 20000:
            continue
        # Fill holes: white parts of the photo itself (sky, windows) aren't background.
        m = (lab == i).astype(np.uint8)
        cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        filled = np.zeros_like(m)
        cv2.drawContours(filled, cnts, -1, 1, thickness=cv2.FILLED)
        out.append((filled.astype(bool), stats[i][:4]))
    return sorted(out, key=lambda r: -r[0].sum())


def largest_rect(mask, ratio=4 / 3):
    """Largest rectangle of the given shape that fits wholly inside the mask, grown from its centre of mass."""
    ys, xs = np.nonzero(mask)
    best = None
    for cy in np.linspace(ys.min(), ys.max(), 15):
        for cx in np.linspace(xs.min(), xs.max(), 15):
            lo, hi = 0, max(mask.shape)
            while hi - lo > 2:
                h = (lo + hi) / 2; w = h * ratio
                y0, y1, x0, x1 = int(cy - h / 2), int(cy + h / 2), int(cx - w / 2), int(cx + w / 2)
                ok = y0 >= 0 and x0 >= 0 and y1 <= mask.shape[0] and x1 <= mask.shape[1] and mask[y0:y1, x0:x1].all()
                lo, hi = (h, hi) if ok else (lo, h)
            if not best or lo > best[0]:
                best = (lo, cx, cy)
    h, cx, cy = best; w = h * ratio
    return int(cx - w / 2), int(cy - h / 2), int(cx + w / 2), int(cy + h / 2)


def composite_parts(rgba, parts):
    rgb = flatten(rgba)
    regions = blob_regions(rgba)
    out = []
    for i, part in enumerate(parts):
        if part.get("original"):
            out.append((np.array(Image.open(os.path.join(ROOT, part["original"])).convert("RGB")), {"rebuiltFrom": part["url"]}))
        elif part.get("bbox"):
            # A crop set by hand, in the composite's own pixels: [left, top, right, bottom].
            x0, y0, x1, y1 = part["bbox"]
            out.append((rgb[y0:y1, x0:x1], {"cropped": "by hand"}))
        else:
            mask, _ = regions[part["blob"] - 1]
            x0, y0, x1, y1 = largest_rect(mask)
            out.append((rgb[y0:y1, x0:x1], {"cropped": "blob"}))
    return out


def knockout_white(rgba):
    """Makes the white background around a badge or logo transparent (only white touching the edges)."""
    out = rgba.copy()
    white = (rgba[..., :3].min(axis=2) > 232).astype(np.uint8)
    n, lab = cv2.connectedComponents(white)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge)) & (white > 0)
    # Soften the edge by a pixel so the shape doesn't look cut out with scissors.
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    out[..., 3] = np.minimum(out[..., 3], alpha)
    return out


def flatten(rgba):
    rgb = rgba[..., :3].astype(np.float32)
    a = rgba[..., 3:4].astype(np.float32) / 255
    return (rgb * a + 255 * (1 - a)).astype(np.uint8)


if __name__ == "__main__":
    Image.MAX_IMAGE_PIXELS = None
    overrides = json.load(open(os.path.join(ROOT, "media", "overrides.json")))
    originals = json.load(open(os.path.join(ROOT, "media", "originals.json")))
    files = sorted(glob.glob(os.path.join(SRC, "**", "*.*"), recursive=True))
    registry, notes = {}, []
    for f in files:
        rel = os.path.relpath(f, SRC).replace(os.sep, "/")
        try:
            rgba = load_rgba(f)
        except Exception as e:
            print("skip", rel, e)
            continue
        kind, disc = classify(f, rgba)
        kind = overrides.get(rel, {}).get("kind", kind)
        if kind == "cutout" and not disc:
            disc = find_disc(rgba) or (rgba.shape[1] / 2, rgba.shape[0] / 2, min(rgba.shape[:2]) * 0.45)
        entry = {"kind": kind}
        if kind == "composite":
            # Several photos in blob shapes on one flattened graphic. Each part becomes its own
            # photo: from its original when one is known, otherwise the largest clean rectangle
            # inside its blob. Part 1 answers to the composite's own address, the rest to #2, #3...
            parts = composite_parts(rgba, overrides[rel]["parts"])
            for i, (img, extra) in enumerate(parts):
                key = "https://www.kuc.org.au/wp-content/uploads/" + rel + ("" if i == 0 else f"#{i + 1}")
                src, w, h = save(img, os.path.splitext(rel)[0] + f"-part{i + 1}" + os.path.splitext(rel)[1], "photo")
                fx, fy, n = focal_point(img)
                registry[key] = {"kind": "photo", "src": src, "w": w, "h": h, "fx": fx, "fy": fy, "faces": n, **extra}
            continue
        if kind == "cutout" and rel in originals["cutouts"]:
            # Use the raw photo the circle graphic was made from.
            o = originals["cutouts"][rel]
            img = np.array(Image.open(os.path.join(ROOT, o["file"])).convert("RGB"))
            entry.update(kind="photo", rebuiltFrom=o["url"])
        elif kind == "cutout":
            # No original: paint out the doodles, then take the largest square inside the circle.
            rgb = flatten(rgba)
            rgb, painted = remove_doodles(rgb, disc)
            cx, cy, r = disc
            half = r * 0.70
            x0, y0 = int(max(0, cx - half)), int(max(0, cy - half))
            img = rgb[y0:int(cy + half), x0:int(cx + half)]
            # Optional trim (left, top, right, bottom as fractions) to cut away a doodle left on an edge.
            t = overrides.get(rel, {}).get("trim")
            if t:
                hh, ww = img.shape[:2]
                img = img[int(t[1] * hh):int(t[3] * hh), int(t[0] * ww):int(t[2] * ww)]
            entry.update(kind="photo", cropped="circle", doodlePixels=painted)
            notes.append(rel)
        elif kind == "graphic":
            if overrides.get(rel, {}).get("knockout"):
                rgba = knockout_white(rgba)
            img = rgba if (rgba[..., 3] < 250).any() else rgba[..., :3]
        else:
            img = flatten(rgba)
        src, w, h = save(img, rel, entry["kind"])
        entry.update(src=src, w=w, h=h)
        if entry["kind"] == "photo":
            fx, fy, n = focal_point(img[..., :3] if img.shape[2] == 4 else img)
            # A focal point set by hand in media/overrides.json wins.
            o = overrides.get(rel, {})
            fx, fy = o.get("fx", fx), o.get("fy", fy)
            entry.update(fx=fx, fy=fy, faces=n)
        registry["https://www.kuc.org.au/wp-content/uploads/" + rel] = entry
    for url, o in originals["featured"].items():
        img = np.array(Image.open(os.path.join(ROOT, o["file"])).convert("RGB"))
        src, w, h = save(img, o["url"].split("/uploads/")[1], "photo")
        fx, fy, n = focal_point(img)
        registry[o["url"]] = {"kind": "photo", "src": src, "w": w, "h": h, "fx": fx, "fy": fy, "faces": n, "featuredFor": url}
    json.dump(dict(sorted(registry.items())), open(os.path.join(ROOT, "media", "images.json"), "w"), indent=1)
    from collections import Counter
    # PDF covers (documents) are added on top, so re-running this keeps them.
    import subprocess, sys
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "register-covers.py")], check=False)
    print(Counter(v["kind"] for v in registry.values()), "rebuilt from originals:", sum(1 for v in registry.values() if v.get("rebuiltFrom")), "cropped from circles:", len(notes))
