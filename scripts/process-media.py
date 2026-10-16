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


if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(SRC, "**", "*.*"), recursive=True))
    out = {}
    for f in files:
        try:
            rgba = load_rgba(f)
        except Exception as e:
            print("skip", f, e)
            continue
        kind, disc = classify(f, rgba)
        rel = os.path.relpath(f, SRC)
        out[rel] = {"kind": kind, "disc": [round(v, 1) for v in disc] if disc else None, "flat": round(flatness(rgba[..., :3]), 3)}
    json.dump(out, open(os.path.join(ROOT, "media", "classify.json"), "w"), indent=1)
    from collections import Counter
    print(Counter(v["kind"] for v in out.values()))
