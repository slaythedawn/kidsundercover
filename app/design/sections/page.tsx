import type { Metadata } from "next";
import PageHero from "@/components/page/PageHero";
import Sections from "@/components/sections/Sections";
import { pageTemplates, sectionSpecs } from "@/content/design";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Section templates for sign off",
  robots: { index: false, follow: false },
};

/** Every section template with a real example, for KUC to review and sign off. */
export default function DesignSections() {
  return (
    <>
      <PageHero
        eyebrow="Design system"
        title="Section templates"
        accent="for sign off."
        intro="Every page on the new site is built from these sections. Each one has a code, what it's for, where it will be used and a live example with real Kids Under Cover content. Once a section is signed off, it's applied across every page that uses it."
        crumbs={[{ label: "Section templates", href: "/design/sections/" }]}
        variant="plain"
      />

      <nav className={s.index} aria-label="Sections">
        <div className="wrap">
          <ul>
            {sectionSpecs.map((x) => (
              <li key={x.code}><a href={`#${x.code}`}><b>{x.code}</b> {x.name}</a></li>
            ))}
            <li><a href="#templates"><b>Pages</b> Page templates</a></li>
          </ul>
        </div>
      </nav>

      {sectionSpecs.map((x) => (
        <article key={x.code} id={x.code} className={s.spec}>
          <div className={`wrap ${s.label}`}>
            <span className={s.code}>{x.code}</span>
            <div>
              <h2 className={s.name}>{x.name}</h2>
              <p className={s.purpose}>{x.purpose}</p>
              <p className={s.used}><b>Used on:</b> {x.usedOn}</p>
            </div>
          </div>
          <div className={s.example}>
            <Sections sections={[x.example]} pageUrl="/design/sections/" />
          </div>
        </article>
      ))}

      <section id="templates" className="section">
        <div className="wrap">
          <div className="section-head"><h2>Page templates</h2></div>
          <p className={s.purpose} style={{ marginBottom: 28 }}>
            Each kind of page uses the same sections in the same order, so the site feels consistent and every page ends with a way to give.
          </p>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>Template</th><th>Used for</th><th>Sections, top to bottom</th><th>Example</th></tr>
              </thead>
              <tbody>
                {pageTemplates.map((t) => (
                  <tr key={t.name}>
                    <th scope="row">{t.name}</th>
                    <td>{t.for}</td>
                    <td>{t.sections}</td>
                    <td>{t.example ? <a href={t.example.href}>{t.example.label}</a> : "None yet"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
