import { hero, links } from "@/content/home";
import Assistant from "./Assistant";
import s from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.stage}>
        <div className={s.photo}>
          <img src={hero.image} alt={hero.imageAlt} />
        </div>

        <a className={s.pill} href={links.donate}>
          <span>{hero.donatePrompt}</span>
          <span className="btn btn-sun">Donate</span>
        </a>

        <div className={`wrap ${s.copy}`}>
          <p className={s.eyebrow}>{hero.eyebrow}</p>
          <h1 id="hero-title" className={s.title}>
            {hero.titleStart} <span className="serif">{hero.titleAccent}</span>
          </h1>
        </div>
      </div>

      <div className={`wrap ${s.assistantWrap}`}>
        <Assistant />
      </div>
    </section>
  );
}
