import s from "./CardGrid.module.css";

export type Card = { title: string; href: string; text?: string; image?: string; tag?: string };

/** Printed photo cards linking to related pages. */
export default function CardGrid({ title, cards, more }: { title?: string; cards: Card[]; more?: { label: string; href: string } }) {
  if (!cards.length) return null;
  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="wrap">
        {(title || more) && (
          <div className="section-head">
            {title && <h2>{title}</h2>}
            {more && <a className="text-link" href={more.href}>{more.label}</a>}
          </div>
        )}
        <ul className={s.grid}>
          {cards.map((c) => (
            <li key={c.href + c.title}>
              <a href={c.href} className={s.card}>
                {c.image ? (
                  <div className={`print ${s.photo}`}><img src={c.image} alt="" loading="lazy" /></div>
                ) : (
                  <div className={s.plain} aria-hidden="true"><span className="ring" /></div>
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
