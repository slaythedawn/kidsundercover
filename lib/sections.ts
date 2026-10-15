/**
 * Section templates. A page is built from a list of these in the `sections`
 * front matter of its content file, top to bottom. Every section is shown,
 * with its purpose and real content, on /design/sections/ for sign off.
 *
 * Text fields accept Markdown: `title`, `intro` and list items take inline
 * Markdown (bold, italics, links); fields named `body` or `answer` take full
 * Markdown (paragraphs, lists).
 */
import type { CtaKey } from "@/content/site";

export type Button = { label: string; href: string; variant?: "sun" | "ink" | "ghost" };
export type Tone = "paper" | "card" | "sun" | "ink";

/** Shared by every section. */
type Base = {
  /** Anchor for jump links, for example `how-it-works` gives /page/#how-it-works. */
  id?: string;
  /** Short label for the jump links section. Defaults to the title. */
  nav?: string;
  eyebrow?: string;
  title?: string;
  /** Words at the end of the title set in the italic serif. */
  accent?: string;
  intro?: string;
  /** Background: paper (default), card (white sheet), sun (yellow band) or ink (dark band). */
  tone?: Tone;
};

export type Image = { src: string; alt?: string; caption?: string };

export type LeadSection = Base & { type: "lead"; text: string; body?: string; aside?: { value: string; label: string; note?: string }; actions?: Button[] };
export type SplitSection = Base & { type: "split"; body: string; image?: string; imageAlt?: string; caption?: string; flip?: boolean; points?: string[]; actions?: Button[] };
export type FeaturesSection = Base & {
  type: "features";
  columns?: 2 | 3 | 4;
  items: { icon?: string; image?: string; title: string; text?: string; href?: string; label?: string }[];
};
export type StepsSection = Base & { type: "steps"; style?: "numbered" | "journey"; items: { icon?: string; title: string; text?: string }[]; actions?: Button[] };
export type StatsSection = Base & { type: "stats"; items: { value: string; label: string }[]; note?: string };
export type FactsSection = Base & {
  type: "facts";
  image?: string;
  imageAlt?: string;
  flip?: boolean;
  items: { value?: string; text: string }[];
  source?: string;
  link?: Button;
};
export type QuoteSection = Base & { type: "quote"; quote: string; name?: string; role?: string; image?: string; imageAlt?: string; href?: string; linkLabel?: string };
export type GallerySection = Base & { type: "gallery"; images: Image[] };
export type VideoSection = Base & { type: "video"; youtube: string; label?: string; poster?: string; body?: string };
export type ChecklistSection = Base & {
  type: "checklist";
  yes: { title: string; items: string[] };
  no?: { title: string; items: string[] };
  note?: string;
};
export type FaqSection = Base & { type: "faq"; items: { question: string; answer: string }[]; more?: Button };
export type CalloutSection = Base & { type: "callout"; icon?: string; body?: string; actions?: Button[]; image?: string; imageAlt?: string };
export type StoriesSection = Base & { type: "stories"; urls?: string[]; program?: string; limit?: number; more?: Button };
export type JumpSection = Base & { type: "jump"; items?: { label: string; href: string }[] };
export type TrustSection = Base & { type: "trust"; items: { icon?: string; text: string }[] };
export type TextSection = Base & { type: "text"; body: string };
export type AskSection = Base & { type: "ask"; cta: CtaKey };
export type FormStartSection = Base & {
  type: "formstart";
  body?: string;
  need?: string[];
  time?: string;
  action: Button;
  help?: string;
  image?: string;
  imageAlt?: string;
};
export type ResourcesSection = Base & { type: "resources"; categories?: string[]; featured?: number };
export type PagesSection = Base & { type: "pages"; urls?: string[]; children?: boolean };

export type PageSection =
  | LeadSection
  | SplitSection
  | FeaturesSection
  | StepsSection
  | StatsSection
  | FactsSection
  | QuoteSection
  | GallerySection
  | VideoSection
  | ChecklistSection
  | FaqSection
  | CalloutSection
  | StoriesSection
  | JumpSection
  | TrustSection
  | TextSection
  | AskSection
  | FormStartSection
  | ResourcesSection
  | PagesSection;

export type SectionType = PageSection["type"];

export const sectionTypes: SectionType[] = [
  "lead",
  "split",
  "features",
  "steps",
  "stats",
  "facts",
  "quote",
  "gallery",
  "video",
  "checklist",
  "faq",
  "callout",
  "stories",
  "jump",
  "trust",
  "text",
  "ask",
  "formstart",
  "resources",
  "pages",
];
