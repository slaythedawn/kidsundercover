/**
 * Downloads every kuc.org.au image the site uses into media/source/, plus the
 * WordPress catalogues (media library, posts, pages) into media/wp-*.json.
 * Runs in GitHub Actions (see .github/workflows/fetch-media.yml), because the
 * build environment can't reach kuc.org.au directly.
 *
 *   node scripts/fetch-media.mjs            images in media/manifest.json
 *   node scripts/fetch-media.mjs --catalog  also refresh the WordPress catalogues
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const UA = { "User-Agent": "Mozilla/5.0 (KUC site rebuild media sync)" };
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "media/manifest.json"), "utf8"));

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.ok) return r;
      if (r.status === 404) return null;
    } catch {}
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  return null;
}

async function images(urls) {
  let ok = 0, skipped = 0;
  const failed = [];
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const url = queue.shift();
        const rel = url.replace(/^https?:\/\/(www\.)?kuc\.org\.au\/wp-content\/uploads\//, "");
        const out = path.join(ROOT, "media/source", rel);
        if (fs.existsSync(out)) { skipped++; continue; }
        const r = await get(url);
        if (!r) { failed.push(url); continue; }
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
        ok++;
      }
    }),
  );
  console.log(`images: ${ok} downloaded, ${skipped} already here, ${failed.length} failed`);
  fs.writeFileSync(path.join(ROOT, "media/failed.json"), JSON.stringify(failed, null, 2) + "\n");
}

async function catalog(type, fields) {
  const all = [];
  // Page by X-WP-TotalPages: WordPress can return short pages when it hides private items.
  let pages = 1;
  for (let page = 1; page <= pages; page++) {
    const r = await get(`https://www.kuc.org.au/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=${fields}`);
    if (!r) break;
    pages = Number(r.headers.get("x-wp-totalpages") ?? 1);
    const rows = await r.json();
    if (Array.isArray(rows)) all.push(...rows);
  }
  fs.writeFileSync(path.join(ROOT, `media/wp-${type}.json`), JSON.stringify(all, null, 1) + "\n");
  console.log(`${type}: ${all.length}`);
}

await images(manifest.images ?? []);
if (process.argv.includes("--catalog") || manifest.catalog) {
  await catalog("media", "id,date,slug,source_url,alt_text,caption,post,media_details.width,media_details.height,mime_type");
  await catalog("posts", "id,date,link,title,featured_media,categories,yoast_head_json.title,yoast_head_json.description");
  await catalog("pages", "id,date,link,title,parent,featured_media,yoast_head_json.title,yoast_head_json.description");
}
