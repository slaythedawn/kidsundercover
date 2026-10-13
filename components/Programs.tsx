import { programs } from "@/content/home";
import s from "./Programs.module.css";

export default function Programs() {
  return (
    <section className="section" aria-labelledby="programs-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="programs-title" className={s.title}>
            <span className={`ring ${s.bullet}`} aria-hidden="true" />
            {programs.title}
          </h2>
          <a className="text-link" href={programs.seeAll.href}>{programs.seeAll.label}</a>
        </div>

        <ul className={s.list}>
          {programs.items.map((p) => (
            <li key={p.name}>
              <a href={p.href} className={s.item}>
                <div className={`print ${s.photo}`}>
                  <img src={p.image} alt={p.imageAlt} loading="lazy" />
                </div>
                <span className={`brush ${s.name}`}>{p.name}</span>
                <p className={s.blurb}>{p.blurb}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
