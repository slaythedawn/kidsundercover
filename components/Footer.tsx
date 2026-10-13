import { footer, site } from "@/content/home";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.grid}`}>
        <img className={s.logo} src={site.logo} alt={site.name} width={160} height={258} />
        <div className={s.cols}>
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className={s.colTitle}>{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a className={`btn btn-sun ${s.news}`} href={footer.newsletter.href}>{footer.newsletter.label}</a>
      </div>
      <p className={`wrap ${s.ack}`}>{footer.acknowledgement}</p>
    </footer>
  );
}
