import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import s from "./PageHero.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  actions?: { label: string; href: string; variant?: "sun" | "ink" | "ghost" }[];
  meta?: React.ReactNode;
};

/**
 * Page header used on every inner page: a paper sheet with the title,
 * and the page photo as a tilted print beside it.
 */
export default function PageHero({ eyebrow, title, intro, image, imageAlt, crumbs, actions, meta }: Props) {
  return (
    <section className={s.hero} data-has-image={!!image}>
      <div className={`wrap ${s.inner}`}>
        <div className={s.copy}>
          {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
          <h1 className={s.title}>{title}</h1>
          {intro && <p className={s.intro}>{intro}</p>}
          {meta && <div className={s.meta}>{meta}</div>}
          {actions && actions.length > 0 && (
            <div className={s.actions}>
              {actions.map((a) => (
                <a key={a.href + a.label} href={a.href} className={`btn btn-${a.variant ?? "sun"}`}>{a.label}</a>
              ))}
            </div>
          )}
        </div>
        {image && (
          <div className={`print ${s.photo}`}>
            <img src={image} alt={imageAlt ?? ""} />
          </div>
        )}
      </div>
    </section>
  );
}
