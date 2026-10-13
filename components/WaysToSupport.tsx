import { ways } from "@/content/home";
import { WayIcon } from "./icons";
import s from "./WaysToSupport.module.css";

export default function WaysToSupport() {
  return (
    <section className="section" aria-labelledby="ways-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 id="ways-title" className={s.title}>{ways.title}</h2>
        <ul className={s.list}>
          {ways.items.map((w) => (
            <li key={w.label}>
              <a href={w.href} className={s.item}>
                <span className={`ring ${s.icon}`}><WayIcon name={w.icon} /></span>
                <span className={s.label}>{w.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
