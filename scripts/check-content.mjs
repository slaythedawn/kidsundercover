// Checks every content file's front matter parses, and with --fix quotes
// plain values that contain a colon (the usual cause of YAML errors).
// Run: node scripts/check-content.mjs [--fix]
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const fix = process.argv.includes("--fix");
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []));
let bad = 0;
for (const file of walk("content")) {
  let raw = fs.readFileSync(file, "utf8");
  try {
    matter(raw, { cache: false });
    continue;
  } catch (e) {
    if (!fix) { console.log("BAD", file, e.reason); bad++; continue; }
  }
  raw = raw.replace(/^---\n([\s\S]*?)\n---/, (all, fm) =>
    "---\n" + fm.split("\n").map((line) => {
      const m = line.match(/^([A-Za-z]+):\s(.+)$/);
      if (!m) return line;
      const v = m[2].trim();
      if (/^["'\[{|>]/.test(v)) return line;
      return `${m[1]}: ${JSON.stringify(v)}`;
    }).join("\n") + "\n---");
  try {
    matter(raw, { cache: false });
    fs.writeFileSync(file, raw);
    console.log("FIXED", file);
  } catch (e) {
    console.log("STILL BAD", file, e.reason); bad++;
  }
}
process.exitCode = bad ? 1 : 0;

// Sections: known types, required fields, and images that exist in the processed set.
const TYPES = {
  lead: ["text"], split: ["body"], features: ["items"], steps: ["items"], stats: ["items"], facts: ["items"],
  quote: ["quote"], gallery: ["images"], video: [], npsp: ["form"], checklist: ["yes"], faq: ["items"], callout: [],
  stories: [], jump: [], trust: ["items"], text: ["body"], ask: ["cta"], formstart: ["action"], resources: [],
  pages: [], donate: ["once", "monthly"],
};
const registry = fs.existsSync("media/images.json") ? JSON.parse(fs.readFileSync("media/images.json", "utf8")) : {};
const imageOk = (u) => !u || u.startsWith("/images/") || !!registry[u.replace(/^https?:\/\/(www\.)?kuc\.org\.au\//, "https://www.kuc.org.au/")];
const images = (sec) => [sec.image, ...(sec.items ?? []).map((i) => i.image), ...(sec.images ?? []).map((i) => i.src)].filter(Boolean);
let sectionErrors = 0;
for (const file of walk("content")) {
  let data;
  try { data = matter(fs.readFileSync(file, "utf8"), { cache: false }).data; } catch { continue; }
  const problems = [];
  if (data.heroImage && !imageOk(data.heroImage)) problems.push(`heroImage not in media/images.json: ${data.heroImage}`);
  if (data.image && !imageOk(data.image)) problems.push(`image not in media/images.json: ${data.image}`);
  (data.sections ?? []).forEach((sec, i) => {
    const where = `section ${i + 1} (${sec?.type})`;
    if (!sec || !TYPES[sec.type]) return problems.push(`${where}: unknown type`);
    for (const f of TYPES[sec.type]) if (sec[f] == null) problems.push(`${where}: missing ${f}`);
    for (const u of images(sec)) if (!imageOk(u)) problems.push(`${where}: image not in media/images.json: ${u}`);
  });
  for (const p of problems) { console.log("SECTION", file, p); sectionErrors++; }
}
if (sectionErrors) process.exitCode = 1;
