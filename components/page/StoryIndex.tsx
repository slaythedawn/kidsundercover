"use client";

import { useMemo, useState } from "react";
import Prose from "./Prose";
import s from "./StoryIndex.module.css";

type Item = { title: string; href: string; image?: string; text?: string; date: string; categories: string[] };

/** All stories and news, newest first, with topic filters and a search box. */
export default function StoryIndex({ stories, intro }: { stories: Item[]; intro?: string }) {
  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    stories.forEach((st) => st.categories.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [stories]);
  const [topic, setTopic] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(12);

  const list = stories.filter(
    (st) =>
      (!topic || st.categories.includes(topic)) &&
      (!q || (st.title + " " + (st.text ?? "")).toLowerCase().includes(q.toLowerCase())),
  );
  const [lead, ...rest] = list;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        {intro && <Prose html={intro} className={s.intro} />}
        <div className={s.controls}>
          <div className={s.chips} role="group" aria-label="Filter by topic">
            <button aria-pressed={!topic} onClick={() => { setTopic(null); setShown(12); }}>All</button>
            {topics.map((t) => (
              <button key={t} aria-pressed={topic === t} onClick={() => { setTopic(t); setShown(12); }}>{t}</button>
            ))}
          </div>
          <label className={s.search}>
            <span className="visually-hidden">Search stories</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories" />
          </label>
        </div>

        {lead && (
          <a href={lead.href} className={s.lead}>
            <div className={`print ${s.leadPhoto}`}>{lead.image && <img src={lead.image} alt="" />}</div>
            <div>
              <p className={s.tag}>{lead.categories[0]}</p>
              <h2 className={s.leadTitle}>{lead.title}</h2>
              {lead.text && <p className={s.text}>{lead.text}</p>}
              <span className="text-link">Read the story</span>
            </div>
          </a>
        )}

        <ul className={s.grid}>
          {rest.slice(0, shown).map((st) => (
            <li key={st.href}>
              <a href={st.href} className={s.card}>
                <div className={`print ${s.photo}`}>{st.image && <img src={st.image} alt="" loading="lazy" />}</div>
                <p className={s.tag}>{st.categories[0]}</p>
                <h3 className={s.title}>{st.title}</h3>
                {st.text && <p className={s.text}>{st.text}</p>}
              </a>
            </li>
          ))}
        </ul>
        {rest.length > shown && (
          <div className={s.more}>
            <button className="btn btn-ghost" onClick={() => setShown((n) => n + 12)}>Show more stories</button>
          </div>
        )}
        {list.length === 0 && <p className={s.empty}>No stories match that search yet.</p>}
      </div>
    </section>
  );
}
