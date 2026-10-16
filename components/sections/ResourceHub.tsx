"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/lib/content";
import Icon from "./Icon";
import s from "./ResourceHub.module.css";

const ORDER = ["Annual reports", "Research", "Plans and policies", "Newsletters", "Guides and forms"];
const rank = (c: string) => (ORDER.includes(c) ? ORDER.indexOf(c) : ORDER.length);

/**
 * S21 Resource hub: every report and PDF in one place. Featured reports sit on
 * top as covers; the rest are grouped into shelves with search and filters.
 * When a resource gets its own page (`page` in content/resources.json) the
 * hub links there and keeps the PDF as a secondary download.
 */
export default function ResourceHub({ items, categories }: { items: Resource[]; categories?: string[] }) {
  const pool = useMemo(
    () => items.filter((i) => i.hub !== false && (!categories || categories.includes(i.category))),
    [items, categories],
  );
  const cats = useMemo(
    () => [...new Set(pool.map((i) => i.category))].sort((a, b) => rank(a) - rank(b)),
    [pool],
  );
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  if (!pool.length) return null;

  const featured = pool.filter((i) => i.featured);
  const filtering = !!cat || !!q;
  const match = (i: Resource) =>
    (!cat || i.category === cat) && (!q || `${i.title} ${i.description ?? ""} ${i.year ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const shelves = cats.map((c) => ({ c, list: pool.filter((i) => i.category === c && match(i)) })).filter((x) => x.list.length);

  return (
    <div className={s.hub}>
      {featured.length > 0 && !filtering && (
        <ul className={s.covers} aria-label="Featured reports">
          {featured.map((r, i) => (
            <li key={r.url}>
              {r.cover ? (
                // The report's real cover, shown as a printed page, with its title underneath.
                <a href={r.page ?? r.url} {...(r.page ? {} : { target: "_blank", rel: "noopener" })} className={s.realCover}>
                  <img src={r.cover} alt="" loading="lazy" />
                  <span className={s.realCoverCat}>{r.category}{r.year ? ` · ${r.year}` : ""}</span>
                  <span className={s.realCoverTitle}>{r.title}</span>
                  <span className={s.realCoverGo}>{r.page ? "Read online" : "Download PDF"}</span>
                </a>
              ) : (
                <a href={r.page ?? r.url} {...(r.page ? {} : { target: "_blank", rel: "noopener" })} className={s.cover} data-n={i % 3}>
                  <span className={s.coverCat}>{r.category}</span>
                  <span className={s.coverTitle}>{r.title}</span>
                  <span className={s.coverFoot}>
                    <span>{r.year}</span>
                    <span>{r.page ? "Read online" : "PDF"}</span>
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className={s.controls}>
        <div className={s.chips} role="group" aria-label="Filter by type">
          <button type="button" aria-pressed={!cat} onClick={() => setCat(null)}>All</button>
          {cats.map((c) => (
            <button type="button" key={c} aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</button>
          ))}
        </div>
        <label className={s.search}>
          <span className="visually-hidden">Search reports</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports, years, topics" />
        </label>
      </div>

      {shelves.length === 0 && <p className={s.empty}>Nothing matches that search. Try another word or clear the filter.</p>}

      {shelves.map(({ c, list }) => (
        <section key={c} className={s.shelf} aria-label={c}>
          <h3 className={s.shelfTitle}>{c} <span>{list.length}</span></h3>
          <ul className={s.list}>
            {list.map((r) => (
              <li key={r.url} className={s.item}>
                {r.cover ? (
                  <img className={s.thumb} src={r.cover} alt="" loading="lazy" />
                ) : (
                  <span className={s.doc} aria-hidden="true"><Icon name="document" /></span>
                )}
                <span className={s.itemText}>
                  <a href={r.page ?? r.url} {...(r.page ? {} : { target: "_blank", rel: "noopener" })} className={s.itemLink}>
                    {r.title}
                  </a>
                  {r.description && <small>{r.description}</small>}
                </span>
                <span className={s.itemMeta}>
                  {r.year && <span>{r.year}</span>}
                  {r.page ? (
                    <>
                      <span className={s.badge}>Page</span>
                      <a className={s.pdf} href={r.url} target="_blank" rel="noopener" aria-label={`Download ${r.title} (PDF)`}>
                        <Icon name="download" size={18} />
                      </a>
                    </>
                  ) : (
                    <span className={s.badge} data-pdf>PDF</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
