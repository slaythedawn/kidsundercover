import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import Photo from "../Photo";
import Doodle from "../Doodle";
import { media, ratio } from "@/lib/media";
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
  /** split: title beside a tilted photo (default). photo: big photo with the title on a paper sheet, for landing pages. plain: no photo. */
  variant?: "split" | "photo" | "plain";
  /** Words at the end of the title set in the italic serif. */
  accent?: string;
};

/**
 * Page header used on every inner page: a paper sheet with the title,
 * and the page photo as a tilted print beside it.
 */
export default function PageHero({ eyebrow, title, intro, image, imageAlt, crumbs, actions, meta, variant = "split", accent }: Props) {
  if (variant === "photo" && image) {
    return (
      <section className={`${s.hero} ${s.photoHero}`}>
        <div className="wrap">
          {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
          <div className={s.stage}>
            <div className={s.stagePhoto}>
              <Photo url={image} alt={imageAlt} eager />
            </div>
            <div className={`sheet sheet-stack ${s.stageSheet}`}>
              {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
              <h1 className={s.title}>
                {title}
                {accent && <> <span className="serif">{accent}</span></>}
              </h1>
              {intro && <p className={s.intro}>{intro}</p>}
              {actions && actions.length > 0 && (
                <div className={s.actions}>
                  {actions.map((a) => (
                    <a key={a.href + a.label} href={a.href} className={`btn btn-${a.variant ?? "sun"}`}>{a.label}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (variant === "plain") image = undefined;
  return (
    <section className={s.hero} data-has-image={!!image}>
      <div className={`wrap ${s.inner}`}>
        <div className={s.copy}>
          {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
          <h1 className={s.title}>
            {title}
            {accent && <> <span className="serif">{accent}</span></>}
          </h1>
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
          <div className={`print ${s.photo}`} style={{ aspectRatio: ratio(media(image), 0.8, 1.5) }}>
            <Photo url={image} alt={imageAlt} eager />
            <Doodle seed={title} corner="tl" />
          </div>
        )}
      </div>
    </section>
  );
}
