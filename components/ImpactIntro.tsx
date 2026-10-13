import { impact } from "@/content/home";
import { HomeAndStudio } from "./icons";
import s from "./ImpactIntro.module.css";

export default function ImpactIntro() {
  return (
    <section className={`section ${s.section}`} aria-labelledby="impact-title">
      <div className={`wrap ${s.grid}`}>
        <div>
          <p className={s.badge}><span className={s.dot} />{impact.badge}</p>
          <h2 id="impact-title" className={s.title}>
            {impact.headlineStart} <mark className={s.mark}>{impact.headlineHighlight}</mark> {impact.headlineEnd}
          </h2>
          <p className={s.body}>{impact.body}</p>
          <dl className={s.stats}>
            {impact.stats.map((st) => (
              <div key={st.label}>
                <dt className={s.value} data-accent={"accent" in st && st.accent ? "" : undefined}>{st.value}</dt>
                <dd className={s.label}>{st.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HomeAndStudio className={s.art} />
      </div>
    </section>
  );
}
