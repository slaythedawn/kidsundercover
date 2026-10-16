/**
 * The section templates. Each one takes its settings straight from a page's
 * `sections` front matter (see lib/sections.ts for every field).
 */
import { ctas } from "@/content/site";
import { childrenOf, firstImage, getEntry, stories as allStories, type PageEntry, type StoryEntry } from "@/lib/content";
import type * as T from "@/lib/sections";
import CardGrid, { type Card } from "@/components/page/CardGrid";
import DonateBand from "@/components/page/DonateBand";
import Icon from "./Icon";
import Photo from "@/components/Photo";
import Doodle from "@/components/Doodle";
import { media, ratio } from "@/lib/media";
import { Band, Buttons, Head, Inline, Md } from "./Section";
import s from "./sections.module.css";

const tilt = (i: number) => (i % 2 ? 1.2 : -1.4);

/** S02 Lead statement: one big sentence that sets up the page, with an optional key number. */
export function Lead(p: T.LeadSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.lead} data-aside={!!p.aside || undefined}>
        <div>
          {p.eyebrow && <p className={s.eyebrow}>{p.eyebrow}</p>}
          <Inline as="p" className={s.leadText} text={p.text} />
          {p.body && <Md className={s.leadBody} text={p.body} />}
          <Buttons items={p.actions} tone={p.tone} />
        </div>
        {p.aside && (
          <div className={`sheet sheet-stack ${s.leadAside}`}>
            <p className={s.bigNumber}>{p.aside.value}</p>
            <p className={s.leadAsideLabel}>{p.aside.label}</p>
            {p.aside.note && <p className={s.note}>{p.aside.note}</p>}
          </div>
        )}
      </div>
    </Band>
  );
}

/** S03 Text and photo: copy beside a tilted printed photo. Alternate `flip` down the page. */
export function Split(p: T.SplitSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.split} data-flip={p.flip || undefined} data-image={!!p.image || undefined}>
        <div className={s.splitCopy}>
          <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
          <Md text={p.body} />
          {p.points && (
            <ul className={s.points}>
              {p.points.map((pt) => (
                <li key={pt}>
                  <span className={s.tick}><Icon name="check" size={16} /></span>
                  <Inline text={pt} />
                </li>
              ))}
            </ul>
          )}
          <Buttons items={p.actions} tone={p.tone} />
        </div>
        {p.image && (
          <figure className={s.splitFigure}>
            <div className={`print ${s.splitPhoto}`} style={{ rotate: `${p.flip ? -1.6 : 1.6}deg`, aspectRatio: ratio(media(p.image), 0.8, 1.5) }}>
              <Photo url={p.image} alt={p.imageAlt} />
              <Doodle seed={p.image} corner={p.flip ? "tr" : "tl"} />
            </div>
            {p.caption && <figcaption className={s.caption}>{p.caption}</figcaption>}
          </figure>
        )}
      </div>
    </Band>
  );
}

/** S04 Feature cards: a grid of short points, each with an icon or photo. */
export function Features(p: T.FeaturesSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
      <ul className={s.features} style={{ ["--cols" as string]: p.columns ?? 3 }}>
        {p.items.map((it, i) => {
          const inner = (
            <>
              {it.image ? (
                <div className={`print ${s.featurePhoto}`} style={{ rotate: `${tilt(i)}deg` }}>
                  <Photo url={it.image} />
                </div>
              ) : it.icon ? (
                <span className={`ring ${s.featureIcon}`}><Icon name={it.icon} /></span>
              ) : null}
              <Inline as="h3" className={s.featureTitle} text={it.title} />
              {it.text && <Md className={s.featureText} text={it.text} />}
              {it.href && <span className={s.featureMore}>{it.label ?? "Find out more"} <Icon name="arrow" size={18} /></span>}
            </>
          );
          return (
            <li key={it.title} className={`sheet ${s.feature}`}>
              {it.href ? <a href={it.href} className={s.featureLink}>{inner}</a> : inner}
            </li>
          );
        })}
      </ul>
    </Band>
  );
}

/** S05 Steps: a numbered process, or a journey with icons (driveway to auction to home). */
export function Steps(p: T.StepsSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
      <ol className={s.steps} data-style={p.style ?? "numbered"} style={{ ["--n" as string]: p.items.length }}>
        {p.items.map((it, i) => (
          <li key={it.title} className={s.step}>
            <span className={s.stepMark} aria-hidden="true">
              {p.style === "journey" && it.icon ? <Icon name={it.icon} size={28} /> : i + 1}
            </span>
            <div>
              <Inline as="h3" className={s.stepTitle} text={it.title} />
              {it.text && <Md className={s.stepText} text={it.text} />}
            </div>
          </li>
        ))}
      </ol>
      <Buttons items={p.actions} tone={p.tone} />
    </Band>
  );
}

/** S06 Number band: three or four headline figures, usually on yellow. */
export function Stats(p: T.StatsSection) {
  const tone = p.tone ?? "sun";
  return (
    <Band id={p.id} tone={tone}>
      <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
      <ul className={s.stats}>
        {p.items.map((it) => (
          <li key={it.label}>
            <p className={s.bigNumber}>{it.value}</p>
            <Inline as="p" className={s.statLabel} text={it.label} />
          </li>
        ))}
      </ul>
      {p.note && <Inline as="p" className={s.note} text={p.note} />}
    </Band>
  );
}

/** S07 Fact cards: sourced figures as cards, with a photo and a link to the research. */
export function Facts(p: T.FactsSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.facts} data-image={!!p.image || undefined} data-flip={p.flip || undefined}>
        <div className={s.factsAside}>
          <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
          {p.image && (
            <div className={`print ${s.factsPhoto}`} style={{ rotate: p.flip ? "1.4deg" : "-1.4deg" }}>
              <Photo url={p.image} alt={p.imageAlt} />
            </div>
          )}
        </div>
        <div>
          <ul className={s.factList}>
            {p.items.map((it) => (
              <li key={it.text} className={`sheet ${s.fact}`} data-value={!!it.value || undefined}>
                {it.value && <p className={s.factValue}>{it.value}</p>}
                <Inline as="p" className={s.factText} text={it.text} />
              </li>
            ))}
          </ul>
          {p.source && <Inline as="p" className={s.source} text={`Source: ${p.source}`} />}
          {p.link && <Buttons items={[{ variant: "ghost", ...p.link }]} tone={p.tone} />}
        </div>
      </div>
    </Band>
  );
}

/** S08 Quote: one voice, large, with a photo and a link to the full story. */
export function Quote(p: T.QuoteSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <figure className={s.quote} data-image={!!p.image || undefined}>
        {p.image && (
          <div className={`print ${s.quotePhoto}`}>
            <Photo url={p.image} alt={p.imageAlt} />
            <Doodle seed={p.quote} corner="br" />
          </div>
        )}
        <div>
          {p.eyebrow && <p className={s.eyebrow}>{p.eyebrow}</p>}
          <blockquote className={s.quoteText}>
            <Inline text={p.quote} />
          </blockquote>
          {(p.name || p.role) && (
            <figcaption className={s.quoteBy}>
              {p.name && <strong>{p.name}</strong>}
              {p.role && <span>{p.role}</span>}
            </figcaption>
          )}
          {p.href && (
            <a className="text-link" href={p.href} style={{ display: "inline-block", marginTop: 20 }}>
              {p.linkLabel ?? "Read the story"}
            </a>
          )}
        </div>
      </figure>
    </Band>
  );
}

/** S09 Photo strip: a row of printed photos. Swipes sideways on phones. */
export function Gallery(p: T.GallerySection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
      <ul className={s.gallery}>
        {p.images.map((im, i) => (
          <li key={im.src}>
            <figure>
              <div className={`print ${s.galleryPhoto}`} style={{ rotate: `${tilt(i)}deg` }}>
                <Photo url={im.src} alt={im.alt} />
              </div>
              {im.caption && <figcaption className={s.caption}>{im.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </Band>
  );
}

/** S11 Checklist: what we accept and what we can't, side by side. */
export function Checklist(p: T.ChecklistSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
      <div className={s.checklist} data-two={!!p.no || undefined}>
        {[{ list: p.yes, yes: true }, ...(p.no ? [{ list: p.no, yes: false }] : [])].map(({ list, yes }) => (
          <div key={list.title} className={`sheet ${s.checkCol}`} data-yes={yes || undefined}>
            <h3 className={s.checkTitle}>{list.title}</h3>
            <ul>
              {list.items.map((it) => (
                <li key={it}>
                  <span className={yes ? s.tick : s.crossMark}><Icon name={yes ? "check" : "cross"} size={16} /></span>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {p.note && <Inline as="p" className={s.note} text={p.note} />}
    </Band>
  );
}

/** S12 Questions: an accordion of FAQs, marked up so Google can show them in results. */
/** `schema` holds every question on the page; blocks without it output no FAQPage record. */
export function Faq(p: T.FaqSection & { schema?: T.FaqSection["items"] }) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.faq}>
        <div>
          <Head eyebrow={p.eyebrow} title={p.title ?? "Questions"} accent={p.accent} intro={p.intro} />
          <Buttons items={p.more ? [{ variant: "ghost", ...p.more }] : undefined} tone={p.tone} />
        </div>
        <div className={s.faqList}>
          {p.items.map((it, i) => (
            <details key={it.question} className={s.faqItem} open={i === 0 || undefined}>
              <summary>
                <Inline text={it.question} />
                <span className={s.faqPlus} aria-hidden="true" />
              </summary>
              <Md className={s.faqAnswer} text={it.answer} />
            </details>
          ))}
        </div>
      </div>
      {p.schema && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: p.schema.map((it) => ({
              "@type": "Question",
              name: it.question.replace(/[*_[\]]/g, ""),
              acceptedAnswer: { "@type": "Answer", text: it.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_]/g, "") },
            })),
          }),
        }}
      />}
    </Band>
  );
}

/** S13 Callout: a boxed next step for one audience, like "Applying for a studio". */
export function Callout(p: T.CalloutSection) {
  return (
    <Band id={p.id} tone={p.tone} tight>
      <div className={`sheet sheet-stack ${s.callout}`} data-image={!!p.image || undefined}>
        <div className={s.calloutCopy}>
          {p.icon && <span className={`ring ${s.featureIcon}`}><Icon name={p.icon} /></span>}
          <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
          {p.body && <Md text={p.body} />}
          <Buttons items={p.actions} />
        </div>
        {p.image && (
          <div className={`print ${s.calloutPhoto}`}>
            <Photo url={p.image} alt={p.imageAlt} />
          </div>
        )}
      </div>
    </Band>
  );
}

const storyCard = (st: StoryEntry): Card => ({ title: st.title, href: st.url, image: st.image ?? firstImage(st.body), tag: st.categories[0], text: st.excerpt });
const pageCard = (pg: PageEntry): Card => ({ title: pg.title, href: pg.url, image: pg.heroImage ?? firstImage(pg.body), text: pg.intro ?? pg.description });

/** S14 Story cards: chosen stories by address, or the latest from one program. */
export function Stories(p: T.StoriesSection) {
  const picked = p.urls
    ? p.urls.map(getEntry).filter((e): e is StoryEntry => !!e && e.kind === "story")
    : allStories().filter((st) => (!p.program || st.program === p.program) && !st.categories.some((c) => /media/i.test(c)));
  return (
    <CardGrid
      id={p.id}
      eyebrow={p.eyebrow}
      title={p.title}
      intro={p.intro}
      cards={picked.slice(0, p.limit ?? 3).map(storyCard)}
      more={p.more}
    />
  );
}

/** S20 Page cards: links to other pages, or this page's children. */
export function Pages(p: T.PagesSection & { pageUrl: string }) {
  const picked = p.children ? childrenOf(p.pageUrl) : (p.urls ?? []).map(getEntry).filter((e): e is PageEntry => !!e && e.kind === "page");
  return <CardGrid id={p.id} eyebrow={p.eyebrow} title={p.title} intro={p.intro} cards={picked.map(pageCard)} />;
}

/** S15 Jump links: a sticky row of chips that skip to sections further down. */
export function Jump(p: T.JumpSection & { auto: { label: string; href: string }[] }) {
  const items = p.items ?? p.auto;
  if (!items.length) return null;
  return (
    <nav className={s.jump} aria-label={p.title ?? "On this page"}>
      <div className="wrap">
        <p className={s.jumpLabel}>{p.title ?? "On this page"}</p>
        <ul>
          {items.map((it) => (
            <li key={it.href}><a href={it.href}>{it.label}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** S16 Trust strip: four short reassurances in a row, straight under the hero. */
export function Trust(p: T.TrustSection) {
  return (
    <section id={p.id} className={s.trust} aria-label={p.title ?? "Why people trust us"}>
      <div className="wrap">
        <ul>
          {p.items.map((it) => (
            <li key={it.text}>
              <Icon name={it.icon ?? "check"} />
              <Inline text={it.text} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** S17 Rich text: plain copy for anything that doesn't fit a template (legal pages, long answers). */
export function Text(p: T.TextSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.text}>
        <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
        <Md className={s.prose} text={p.body} />
      </div>
    </Band>
  );
}

/** S18 Giving ask: the yellow donation card, placed mid page. */
export function Ask(p: T.AskSection) {
  return ctas[p.cta] ? <DonateBand cta={p.cta} /> : null;
}

/** S19 Form start: everything someone needs before they open the form, then one big button. */
export function FormStart(p: T.FormStartSection) {
  return (
    <Band id={p.id} tone={p.tone}>
      <div className={s.formStart}>
        <div>
          <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />
          {p.body && <Md text={p.body} />}
          {p.need && (
            <>
              <h3 className={s.checkTitle}>Have these handy</h3>
              <ul className={s.points}>
                {p.need.map((n) => (
                  <li key={n}>
                    <span className={s.tick}><Icon name="check" size={16} /></span>
                    <Inline text={n} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className={`sheet sheet-stack ${s.formPanel}`}>
          {p.image && (
            <div className={`print ${s.formPhoto}`}>
              <Photo url={p.image} alt={p.imageAlt} />
            </div>
          )}
          {p.time && (
            <p className={s.formTime}>
              <Icon name="clock" /> {p.time}
            </p>
          )}
          <a className={`btn btn-ink ${s.formButton}`} href={p.action.href}>
            {p.action.label} <Icon name="arrow" size={18} />
          </a>
          {p.help && <Md className={s.formHelp} text={p.help} />}
        </div>
      </div>
    </Band>
  );
}

/** Just the heading, for sections whose body is a separate component. */
export function HeadOnly(p: { eyebrow?: string; title?: string; accent?: string; intro?: string }) {
  return <Head eyebrow={p.eyebrow} title={p.title} accent={p.accent} intro={p.intro} />;
}
