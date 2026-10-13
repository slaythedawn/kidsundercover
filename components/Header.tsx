"use client";

import { useEffect, useState } from "react";
import { links, nav, site } from "@/content/home";
import s from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={s.header}>
      <a className="visually-hidden" href="#main">Skip to content</a>
      <div className={s.bar}>
        <a href="/" className={s.logo} aria-label={`${site.name} home`}>
          <img src={site.logo} alt="" width={160} height={258} />
        </a>

        <nav className={s.nav} aria-label="Main">
          {nav.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className={s.actions}>
          <a className={s.phone} href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          <a className="btn btn-sun" href={links.donate}>{site.donateLabel}</a>
          <a className={`btn btn-ink ${s.contact}`} href={links.contact}>{site.contactLabel}</a>
          <button
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={s.burger} data-open={open} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={s.drawer} data-open={open} hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
        </nav>
        <div className={s.drawerFoot}>
          <a className="btn btn-ink" href={links.contact}>{site.contactLabel}</a>
          <a className="btn btn-ghost" href={`tel:${site.phone.replace(/\s/g, "")}`}>Call {site.phone}</a>
        </div>
      </div>
    </header>
  );
}
