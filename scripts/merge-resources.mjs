// Merges the PDF lists collected during migration (content/_resources/*.json)
// into content/resources.json, the list behind the resource library.
// Run: node scripts/merge-resources.mjs
import fs from "node:fs";
import path from "node:path";

const dir = path.join("content", "_resources");
const seen = new Map();
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  for (const r of JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))) {
    if (!r?.url || !/\.pdf($|\?)/i.test(r.url)) continue;
    const url = r.url.replace(/^http:/, "https:").replace(/[?#].*$/, "");
    if (!seen.has(url)) seen.set(url, { ...r, url, title: (r.title || path.basename(url)).trim() });
  }
}
const list = [...seen.values()].sort((a, b) => (b.year || "").localeCompare(a.year || "") || a.title.localeCompare(b.title));
fs.writeFileSync(path.join("content", "resources.json"), JSON.stringify(list, null, 2) + "\n");
console.log(`${list.length} PDFs written to content/resources.json`);
