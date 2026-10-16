import Photo from "../Photo";
import Doodle from "../Doodle";
import s from "./CardGrid.module.css";

export type Card = { title: string; href: string; text?: string; image?: string; tag?: string };

/** Printed photo cards linking to related pages. */
type Props = { id?: string; eyebrow?: string; title?: string; intro?: string; cards: Card[]; more?: { label: string; href: string } };

export default function CardGrid({ id, eyebrow, title, intro, cards, more }: Props) {
  if (!cards.length) return null;
  return (
    <section id={id} className="section" style={{ paddingTop: 24 }}>
      <div className="wrap">
        {(title || more) && (
          <div className="section-head">
            <div>
              {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
              {title && <h2>{title}</h2>}
              {intro && <p className={s.intro}>{intro}</p>}
            </div>
            {more && <a className="text-link" href={more.href}>{more.label}</a>}
          </div>
        )}
        <ul className={s.grid}>
          {cards.map((c) => (
            <li key={c.href + c.title}>
              <a href={c.href} className={s.card}>
                {c.image ? (
                  <div className={`print ${s.photo}`}><Photo url={c.image} /></div>
                ) : (
                  <div className={s.plain} aria-hidden="true">
                    <span className={s.plainLabel}>{c.tag ?? "Kids Under Cover"}</span>
                    <Doodle seed={c.title} corner="br" />
                  </div>
                )}
                {c.tag && <p className={s.tag}>{c.tag}</p>}
                <h3 className={s.title}>{c.title}</h3>
                {c.text && <p className={s.text}>{c.text}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
