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
