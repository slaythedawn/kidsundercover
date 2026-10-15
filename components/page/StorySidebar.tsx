import { ctas, links, type CtaKey } from "@/content/site";
import s from "./StorySidebar.module.css";

/** Sticky giving card beside every story, so readers can act while they feel it. */
export default function StorySidebar({ cta }: { cta: CtaKey }) {
  const c = ctas[cta];
  return (
    <aside className={s.side} aria-label="Support this work">
      <div className={`sheet ${s.card}`}>
        <p className={s.eyebrow}>{c.eyebrow}</p>
        <p className={s.title}>{c.title} <span className="serif">{c.accent}</span></p>
        <a className="btn btn-sun" href={c.primary.href}>{c.primary.label}</a>
        <ul>
          <li><a href={links.monthly}>Give monthly</a></li>
          <li><a href={links.donateYourCar}>Donate your car</a></li>
          <li><a href={links.giftsInWills}>Gift in your will</a></li>
        </ul>
      </div>
    </aside>
  );
}
