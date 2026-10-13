import { target450 } from "@/content/home";
import { Target450Art } from "./icons";
import s from "./Target450.module.css";

export default function Target450() {
  return (
    <section className="section" aria-labelledby="t450-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className={`sheet sheet-stack ${s.card}`}>
          <div className={s.copy}>
            <p className={s.eyebrow}>{target450.eyebrow}</p>
            <h2 id="t450-title" className={s.title}>
              {target450.titleStart} <span className="serif">{target450.titleAccent}</span>
            </h2>
            <a className="btn btn-ink" href={target450.cta.href}>{target450.cta.label}</a>
          </div>
          <div className={`print ${s.art}`}>
            <Target450Art />
          </div>
        </div>
      </div>
    </section>
  );
}
