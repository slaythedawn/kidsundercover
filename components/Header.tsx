"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { links, nav, site } from "@/content/site";
import s from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [mobileGroup, setMobileGroup] = useState<number | null>(null);
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  // Close menus when the page changes.
  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  const tel = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <header className={s.header} data-home={isHome}>
      <a className="visually-hidden" href="#main">Skip to content</a>
      <div className={s.bar} ref={barRef}>
        <a href="/" className={s.logo} aria-label={`${site.name} home`}>
          <img src={site.logo} alt="" width={160} height={258} />
        </a>

        <nav className={s.nav} aria-label="Main">
          <ul>
            {nav.map((group, i) => {
              const active = pathname?.startsWith(group.href) && group.href !== "/";
              return (
                <li key={group.label} onMouseEnter={() => setMenu(i)} onMouseLeave={() => setMenu(null)}>
                  <button
                    type="button"
                    className={s.top}
                    aria-expanded={menu === i}
                    aria-controls={`menu-${i}`}
                    data-active={active || undefined}
                    onClick={() => setMenu(menu === i ? null : i)}
                  >
                    {group.label}
                    <span className={s.caret} aria-hidden="true" />
                  </button>
                  <div id={`menu-${i}`} className={s.panel} data-open={menu === i} hidden={menu !== i}>
                    <div className={s.panelInner}>
                      <div className={s.panelIntro}>
                        <a href={group.href} className={s.panelTitle}>{group.label}</a>
                        <p>{group.intro}</p>
                      </div>
                      <ul className={s.panelLinks}>
                        {group.items.map((item) => (
                          <li key={item.href + item.label}>
                            <a href={item.href}>
                              <span>{item.label}</span>
                              {item.note && <small>{item.note}</small>}
                            </a>
                          </li>
                        ))}
                      </ul>
                      {group.feature && (
                        <a href={group.feature.href} className={s.feature}>
                          <span className={s.featureLabel}>{group.feature.label}</span>
                          <span>{group.feature.note}</span>
                          <span className={s.featureGo} aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            <li>
              <a href={links.stories} className={s.top} data-active={pathname?.startsWith(links.stories) || undefined}>Stories</a>
            </li>
          </ul>
        </nav>

        <div className={s.actions}>
          <a className={s.phone} href={tel}>{site.phone}</a>
          <a className={`btn btn-ghost ${s.car}`} href={links.donateYourCar}>Donate your car</a>
          <a className="btn btn-sun" href={links.donate}>{site.donateLabel}</a>
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

      <div id="mobile-menu" className={s.drawer} hidden={!open}>
        <a className={`btn btn-sun ${s.drawerDonate}`} href={links.donate}>Donate now</a>
        <nav aria-label="Mobile">
          {nav.map((group, i) => (
            <div key={group.label} className={s.drawerGroup}>
              <button
                type="button"
                aria-expanded={mobileGroup === i}
                onClick={() => setMobileGroup(mobileGroup === i ? null : i)}
              >
                {group.label}
                <span className={s.caret} aria-hidden="true" />
              </button>
              <ul hidden={mobileGroup !== i}>
                <li><a href={group.href}>{group.label} overview</a></li>
                {group.items.map((item) => (
                  <li key={item.href + item.label}><a href={item.href}>{item.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div className={s.drawerGroup}>
            <a href={links.stories} className={s.drawerLink}>Stories</a>
          </div>
        </nav>
        <div className={s.drawerFoot}>
          <a className="btn btn-ink" href={links.donateYourCar}>Donate your car</a>
          <a className="btn btn-ghost" href={tel}>Call {site.phone}</a>
        </div>
      </div>
    </header>
  );
}
