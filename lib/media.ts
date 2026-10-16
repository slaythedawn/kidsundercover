/**
 * Processed KUC images (see scripts/process-media.py and media/images.json).
 *
 * Content files keep the original kuc.org.au addresses. media() swaps in the
 * processed copy from /public/media with its kind, size and focal point, so
 * crops keep faces in frame and graphics are never cropped.
 */
import fs from "node:fs";
import path from "node:path";

export type Img = {
  src: string;
  kind: "photo" | "graphic";
  w?: number;
  h?: number;
  /** Focal point as fractions of width and height. */
  fx?: number;
  fy?: number;
};

let registry: Record<string, Img> | null = null;

function load() {
  if (!registry) {
    const file = path.join(process.cwd(), "media", "images.json");
    registry = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  }
  return registry!;
}

const key = (url: string) => url.replace(/^https?:\/\/(www\.)?kuc\.org\.au\//, "https://www.kuc.org.au/");

export function media(url?: string): Img | undefined {
  if (!url) return undefined;
  const hit = load()[key(url)];
  if (hit) return { src: hit.src, kind: hit.kind, w: hit.w, h: hit.h, fx: hit.fx, fy: hit.fy };
  return { src: url, kind: "photo" };
}

/** CSS object-position for a photo, so cropping keeps the focal point in frame. */
export const focus = (img?: Img) => (img?.fx != null ? `${Math.round(img.fx * 100)}% ${Math.round((img.fy ?? 0.42) * 100)}%` : "50% 40%");

/** The photo's own shape, kept within sensible limits, for frames that follow the image. */
export function ratio(img?: Img, min = 0.8, max = 1.6) {
  if (!img?.w || !img?.h) return undefined;
  return String(Math.min(max, Math.max(min, img.w / img.h)));
}
