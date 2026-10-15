import { ctas, type CtaKey } from "@/content/site";
import { Target450Art } from "../icons";
import s from "./DonateBand.module.css";

/** The giving ask that closes every page, matched to what the page is about. */
export default function DonateBand({ cta }: { cta: CtaKey }) {
  const c = ctas[cta];
  return (
    <section className="section" aria-label={c.eyebrow} style={{ paddingTop: 24 }}>
      <div className="wrap">
        <div className={`sheet sheet-stack ${s.card}`}>
          <div>
            <p className={s.eyebrow}>{c.eyebrow}</p>
            <h2 className={s.title}>
              {c.title} <span className="serif">{c.accent}</span>
            </h2>
            <p className={s.body}>{c.body}</p>
            <div className={s.actions}>
              <a className="btn btn-ink" href={c.primary.href}>{c.primary.label}</a>
              {c.secondary && <a className="btn btn-ghost" href={c.secondary.href}>{c.secondary.label}</a>}
            </div>
          </div>
          <div className={`print ${s.art}`} aria-hidden="true">
            <Target450Art />
          </div>
        </div>
      </div>
    </section>
  );
}
