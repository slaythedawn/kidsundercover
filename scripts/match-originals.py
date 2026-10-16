"""
Finds the raw photo behind each KUC circle graphic (cutout) by matching image
features against the WordPress media library (media/library/, see fetch-media.mjs).
Writes media/originals.json: { cutout file: { id, url, inliers } }.
"""
import json, os, glob
import numpy as np, cv2
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sift = cv2.SIFT_create(nfeatures=1500)


def grey(path, max_side=500):
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    a = np.array(bg.convert("L"))
    s = max_side / max(a.shape)
    return cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA) if s < 1 else a


def disc_core(path, disc, max_side=500):
    """The square inside the circle, where doodles mostly aren't."""
    cx, cy, r = disc
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    a = np.array(bg.convert("L"))
    h = r * 0.70
    a = a[int(max(0, cy - h)):int(cy + h), int(max(0, cx - h)):int(cx + h)]
    s = max_side / max(a.shape)
    return cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA) if s < 1 else a


if __name__ == "__main__":
    cls = json.load(open(os.path.join(ROOT, "media/classify.json")))
    ov = json.load(open(os.path.join(ROOT, "media/overrides.json")))
    lib = {str(m["id"]): m for m in json.load(open(os.path.join(ROOT, "media/wp-media.json")))}
    feats = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "media/library/*"))):
        mid = os.path.splitext(os.path.basename(f))[0]
        try:
            g = grey(f)
        except Exception:
            continue
        kp, des = sift.detectAndCompute(g, None)
        if des is not None and len(kp) > 20:
            feats[mid] = (kp, des)
    print("library features", len(feats))
    bf = cv2.BFMatcher()
    out = {}
    for rel, c in cls.items():
        kind = ov.get(rel, {}).get("kind", c["kind"])
        if kind != "cutout":
            continue
        disc = c["disc"]
        if not disc:
            continue
        g = disc_core(os.path.join(ROOT, "media/source", rel), disc)
        kp1, des1 = sift.detectAndCompute(g, None)
        if des1 is None:
            continue
        best = (None, 0)
        for mid, (kp2, des2) in feats.items():
            name = lib[mid]["source_url"].lower()
            # Skip other flattened graphics: the montages themselves and square circle PNGs.
            if "montage" in name or (name.endswith(".png") and lib[mid].get("media_details", {}).get("width") == lib[mid].get("media_details", {}).get("height")):
                continue
            m = bf.knnMatch(des1, des2, k=2)
            good = [a for a, b in (x for x in m if len(x) == 2) if a.distance < 0.72 * b.distance]
            if len(good) < 12:
                continue
            src = np.float32([kp1[a.queryIdx].pt for a in good]).reshape(-1, 1, 2)
            dst = np.float32([kp2[a.trainIdx].pt for a in good]).reshape(-1, 1, 2)
            H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
            n = int(mask.sum()) if mask is not None else 0
            if n > best[1]:
                best = (mid, n)
        mid, n = best
        # Skip the cutout matching itself (the montage file is also in the library).
        ok = bool(mid) and n >= 15
        out[rel] = {"id": mid, "url": lib[mid]["source_url"] if mid else None, "inliers": n, "ok": bool(ok)}
        print(f"{rel:60s} -> {mid} {n} {'MATCH ' + lib[mid]['source_url'].split('/uploads/')[1] if ok else ''}")
    json.dump(out, open(os.path.join(ROOT, "media/originals.json"), "w"), indent=1)
