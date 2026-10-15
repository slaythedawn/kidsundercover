import { explore } from "@/content/home";
import s from "./Explore.module.css";

export default function Explore() {
  return (
    <section className="section" aria-labelledby="explore-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head"><h2 id="explore-title">{explore.title}</h2></div>
        <ul className={s.grid}>
          {explore.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={`sheet ${s.card}`}>
                <span className={s.tag}>{item.tag}</span>
                <span className={s.title}>{item.title}</span>
                <span className={s.text}>{item.text}</span>
                <span className={s.go} aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
