"""
Adds every PDF cover (public/media/pdf-covers/, made by the fetch-media Action)
to media/images.json as a "document" image, keyed by the cover's own address,
so pages can use /media/pdf-covers/... as a hero or section image.
Run after the Action: python3 scripts/register-covers.py
"""
import json, os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
reg_path = os.path.join(ROOT, "media", "images.json")
reg = json.load(open(reg_path))
n = 0
for f in glob.glob(os.path.join(ROOT, "public", "media", "pdf-covers", "**", "*.jpg"), recursive=True):
    src = "/" + os.path.relpath(f, os.path.join(ROOT, "public")).replace(os.sep, "/")
    w, h = Image.open(f).size
    reg[src] = {"kind": "document", "src": src, "w": w, "h": h}
    n += 1
json.dump(dict(sorted(reg.items())), open(reg_path, "w"), indent=1)
print(f"registered {n} covers")
