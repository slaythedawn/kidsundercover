import { stories } from "@/content/home";
import { CarDrawing } from "./icons";
import s from "./Stories.module.css";

export default function Stories() {
  const f = stories.featured;
  return (
    <section className="section" aria-labelledby="stories-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="stories-title">{stories.title}</h2>
          <a className="text-link" href={stories.viewAll.href}>{stories.viewAll.label}</a>
        </div>

        <div className={s.grid}>
          <a href={f.href} className={s.featured}>
            <div className={`print ${s.featuredPhoto}`}>
              <img src={f.image} alt={f.imageAlt} loading="lazy" />
            </div>
            <p className={s.tag}>{f.tag}</p>
            <h3 className={s.featuredTitle}>
              {f.titleStart} <span className="serif">{f.titleAccent}</span>
            </h3>
            <p className={s.summary}>{f.summary}</p>
          </a>

          <ul className={s.more}>
            {stories.more.map((m) => (
              <li key={m.title}>
                <a href={m.href} className={s.row}>
                  <div className={`print ${s.thumb}`}>
                    {m.image ? <img src={m.image} alt={m.imageAlt} loading="lazy" /> : <CarDrawing />}
                  </div>
                  <div>
                    <p className={s.tag}>{m.tag}</p>
                    <h3 className={s.rowTitle}>{m.title}</h3>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
