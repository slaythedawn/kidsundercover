import { renderInline, renderMarkdown } from "@/lib/content";
import type { Button, Tone } from "@/lib/sections";
import s from "./sections.module.css";

/** Inline Markdown, for titles and list items. */
export function Inline({ text, as: Tag = "span", className }: { text: string; as?: "span" | "p" | "h2" | "h3" | "strong"; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: renderInline(text) }} />;
}

/** Full Markdown, for body copy. */
export function Md({ text, className }: { text: string; className?: string }) {
  return <div className={`${s.md} ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />;
}

export function Buttons({ items, tone }: { items?: Button[]; tone?: Tone }) {
  if (!items?.length) return null;
  return (
    <div className={s.buttons}>
      {items.map((b, i) => {
        // On yellow and dark bands the default button colours swap so they stay visible.
        let v = b.variant ?? (i === 0 ? "sun" : "ghost");
        if (tone === "sun" && v === "sun") v = "ink";
        const cls = tone === "ink" && v === "ghost" ? "btn btn-outline-light" : `btn btn-${v}`;
        const external = /^https?:/.test(b.href);
        return (
          <a key={b.href + b.label} className={cls} href={b.href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
            {b.label}
          </a>
        );
      })}
    </div>
  );
}

type HeadProps = { eyebrow?: string; title?: string; accent?: string; intro?: string; center?: boolean; level?: 2 | 3 };

export function Head({ eyebrow, title, accent, intro, center, level = 2 }: HeadProps) {
  if (!eyebrow && !title && !intro) return null;
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className={s.head} data-center={center || undefined}>
      {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
      {title && (
        <H className={s.title}>
          <span dangerouslySetInnerHTML={{ __html: renderInline(title) }} />
          {accent && <> <span className="serif">{accent}</span></>}
        </H>
      )}
      {intro && <p className={s.intro} dangerouslySetInnerHTML={{ __html: renderInline(intro) }} />}
    </div>
  );
}

/** Outer band for every section: sets the background tone and anchor. */
export function Band({ id, tone = "paper", children, tight, label }: { id?: string; tone?: Tone; children: React.ReactNode; tight?: boolean; label?: string }) {
  return (
    <section id={id} className={s.band} data-tone={tone} data-tight={tight || undefined} aria-label={label}>
      <div className="wrap">{children}</div>
    </section>
  );
}
