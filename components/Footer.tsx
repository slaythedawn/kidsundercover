import { footer, links, site } from "@/content/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`wrap ${s.give}`}>
        <p className={s.giveText}>
          Every gift keeps a young person <span className="serif">close to home.</span>
        </p>
        <div className={s.giveActions}>
          <a className="btn btn-sun" href={links.donate}>Donate now</a>
          <a className="btn btn-outline-light" href={links.monthly}>Give monthly</a>
          <a className="btn btn-outline-light" href={links.donateYourCar}>Donate your car</a>
        </div>
      </div>
      <div className={`wrap ${s.grid}`}>
        <div className={s.brand}>
          <img className={s.logo} src={site.logo} alt={site.name} width={160} height={258} />
          <p>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          </p>
          <a className="btn btn-sun" href={footer.newsletter.href}>{footer.newsletter.label}</a>
        </div>
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
      </div>
      <div className={`wrap ${s.base}`}>
        <ul className={s.inline}>
          {footer.social.map((l) => (
            <li key={l.label}><a href={l.href} target="_blank" rel="noopener">{l.label}</a></li>
          ))}
        </ul>
        <ul className={s.inline}>
          {footer.legal.map((l) => (
            <li key={l.label}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      </div>
      <p className={`wrap ${s.ack}`}>{footer.acknowledgement}</p>
    </footer>
  );
}
