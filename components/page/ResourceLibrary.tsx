"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/lib/content";
import s from "./ResourceLibrary.module.css";

/** Every report and PDF in one searchable list, instead of links scattered across pages. */
export default function ResourceLibrary({ items }: { items: Resource[] }) {
  const cats = useMemo(() => [...new Set(items.map((i) => i.category))].sort(), [items]);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  if (!items.length) return null;
  const list = items.filter(
    (i) => (!cat || i.category === cat) && (!q || (i.title + " " + (i.description ?? "")).toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <section className="section" style={{ paddingTop: 16 }} aria-labelledby="library-title">
      <div className="wrap">
        <div className="section-head"><h2 id="library-title">Reports and resources</h2></div>
        <div className={s.controls}>
          <div className={s.chips} role="group" aria-label="Filter by type">
            <button aria-pressed={!cat} onClick={() => setCat(null)}>All ({items.length})</button>
            {cats.map((c) => (
              <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <input className={s.search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports" aria-label="Search reports" />
        </div>
        <ul className={s.list}>
          {list.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener" className={s.item}>
                <span className={s.doc} aria-hidden="true">PDF</span>
                <span>
                  <strong>{r.title}</strong>
                  {r.description && <small>{r.description}</small>}
                </span>
                <span className={s.meta}>{[r.category, r.year].filter(Boolean).join(" · ")}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
