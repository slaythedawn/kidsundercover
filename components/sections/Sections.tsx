import { renderInline, renderMarkdown, resources } from "@/lib/content";
import type { PageSection } from "@/lib/sections";
import * as B from "./blocks";
import { Band, Md } from "./Section";
import Video from "./Video";
import ResourceHub from "./ResourceHub";
import DonateForm from "./DonateForm";
import NpspDonate from "./NpspDonate";
import Photo from "@/components/Photo";
import Doodle from "@/components/Doodle";
import { external } from "@/content/site";
import { media } from "@/lib/media";
import s from "./sections.module.css";

/** Renders a page's `sections` front matter, top to bottom. */
export default function Sections({ sections, pageUrl }: { sections: PageSection[]; pageUrl: string }) {
  // Jump links list every section below them that has an id.
  const anchors = sections
    .filter((x) => x.id && x.type !== "jump" && (x.nav || x.title))
    .map((x) => ({ label: (x.nav ?? x.title ?? "").replace(/[*_]/g, ""), href: `#${x.id}` }));
  // Google allows one FAQPage per page, so the first FAQ block carries every question on the page.
  const faqs = sections.flatMap((x) => (x.type === "faq" ? x.items : []));
  const firstFaq = sections.findIndex((x) => x.type === "faq");

  return (
    <>
      {sections.map((sec, i) => {
        const key = `${sec.type}-${i}`;
        switch (sec.type) {
          case "lead": return <B.Lead key={key} {...sec} />;
          case "split": return <B.Split key={key} {...sec} />;
          case "features": return <B.Features key={key} {...sec} />;
          case "steps": return <B.Steps key={key} {...sec} />;
          case "stats": return <B.Stats key={key} {...sec} />;
          case "facts": return <B.Facts key={key} {...sec} />;
          case "quote": return <B.Quote key={key} {...sec} />;
          case "gallery": return <B.Gallery key={key} {...sec} />;
          case "checklist": return <B.Checklist key={key} {...sec} />;
          case "faq": return <B.Faq key={key} {...sec} schema={i === firstFaq ? faqs : undefined} />;
          case "callout": return <B.Callout key={key} {...sec} />;
          case "stories": return <B.Stories key={key} {...sec} />;
          case "pages": return <B.Pages key={key} {...sec} pageUrl={pageUrl} />;
          case "jump": return <B.Jump key={key} {...sec} auto={anchors} />;
          case "trust": return <B.Trust key={key} {...sec} />;
          case "text": return <B.Text key={key} {...sec} />;
          case "ask": return <B.Ask key={key} {...sec} />;
          case "formstart": return <B.FormStart key={key} {...sec} />;
          case "video":
            return (
              <Band key={key} id={sec.id} tone={sec.tone}>
                <Video
                  youtube={sec.youtube}
                  vimeo={sec.vimeo}
                  label={sec.label}
                  poster={sec.poster ? media(sec.poster)?.src ?? sec.poster : undefined}
                  eyebrow={sec.eyebrow}
                  titleHtml={sec.title ? renderInline(sec.title) + (sec.accent ? ` <span class="serif">${sec.accent}</span>` : "") : undefined}
                  introHtml={sec.intro ? renderInline(sec.intro) : undefined}
                  bodyHtml={sec.body ? renderMarkdown(sec.body) : undefined}
                />
              </Band>
            );
          case "resources":
            return (
              <Band key={key} id={sec.id} tone={sec.tone}>
                <B.HeadOnly {...sec} />
                <ResourceHub items={resources()} categories={sec.categories} />
              </Band>
            );
          case "donate":
            return (
              <Band key={key} id={sec.id} tone={sec.tone}>
                <div className={s.donate} data-image={!!sec.image || undefined}>
                  {sec.image && (
                    <figure className={s.donateAside}>
                      <div className={`print ${s.donatePhoto}`}>
                        <Photo url={sec.image} alt={sec.imageAlt} eager />
                        <Doodle seed={sec.image} corner="tl" />
                      </div>
                      {sec.quote && (
                        <blockquote className={s.donateQuote}>
                          <p>{sec.quote}</p>
                          {sec.quoteBy && <footer>{sec.quoteBy}</footer>}
                        </blockquote>
                      )}
                    </figure>
                  )}
                  <DonateForm
                    start={sec.start}
                    once={sec.once}
                    monthly={sec.monthly}
                    note={sec.note}
                    donateUrl={external.donate}
                    monthlyUrl={external.monthlyForm}
                    amountParam={external.donateAmountParam}
                    titleHtml={sec.title ? renderInline(sec.title) + (sec.accent ? ` <span class="serif">${sec.accent}</span>` : "") : undefined}
                    introHtml={sec.intro ? renderInline(sec.intro) : undefined}
                  />
                </div>
              </Band>
            );
          case "npsp":
            return (
              <Band key={key} id={sec.id} tone={sec.tone}>
                <div className={s.npsp}>
                  <div>
                    <B.HeadOnly {...sec} />
                    {sec.body && <Md className={s.md} text={sec.body} />}
                    {sec.image && (
                      <div className={`print ${s.donatePhoto}`}>
                        <Photo url={sec.image} alt={sec.imageAlt} />
                      </div>
                    )}
                    {sec.note && <p className={s.note} dangerouslySetInnerHTML={{ __html: renderInline(sec.note) }} />}
                  </div>
                  <NpspDonate form={sec.form} />
                </div>
              </Band>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
