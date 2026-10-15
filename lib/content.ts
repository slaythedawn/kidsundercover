/**
 * Loads every page, story, media release and team profile from /content.
 *
 * Each Markdown file carries its own `url` in front matter, so the site keeps
 * the same addresses as kuc.org.au. Edit a page by editing its file; add a
 * page by adding a file with a new `url`.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import type { CtaKey } from "@/content/site";
import type { Button, PageSection } from "@/lib/sections";

const ROOT = path.join(process.cwd(), "content");

export type Section = "work" | "impact" | "give" | "about" | "support" | "legal" | "campaign" | "other";
export type Template = "page" | "program" | "give" | "facts" | "legal" | "listing";

export type PageEntry = {
  kind: "page";
  url: string;
  title: string;
  /** Words after the title set in the italic serif, for example "Their new beginning." */
  titleAccent?: string;
  seoTitle?: string;
  description?: string;
  eyebrow?: string;
  intro?: string;
  heroImage?: string;
  heroAlt?: string;
  section: Section;
  template: Template;
  cta: CtaKey | "none";
  related: string[];
  status: "live" | "merged" | "retired";
  redirectTo?: string;
  order?: number;
  form?: FormKind;
  /** Section templates that make up the page. Without them the body renders as plain text. */
  sections?: PageSection[];
  /** split (title beside a tilted photo, default), photo (large photo with the title on a sheet) or plain. */
  heroStyle?: "split" | "photo" | "plain";
  /** Hero buttons. Without them, program and giving pages get sensible defaults. */
  actions?: Button[];
  /** Keep a page out of search results, for paid campaign pages. */
  noindex?: boolean;
  body: string;
  file: string;
};

export type FormKind = "newsletter" | "contact" | "scholarship" | "studio" | "fundraising" | "donate";

export type StoryEntry = {
  kind: "story";
  url: string;
  title: string;
  description?: string;
  date: string;
  categories: string[];
  program?: string;
  image?: string;
  imageAlt?: string;
  excerpt?: string;
  cta: CtaKey | "none";
  body: string;
  file: string;
};

export type TeamEntry = {
  kind: "team";
  url: string;
  name: string;
  role?: string;
  group?: string;
  image?: string;
  order?: number;
  description?: string;
  body: string;
  file: string;
};

export type Resource = {
  title: string;
  url: string;
  category: string;
  year?: string;
  description?: string;
  foundOn?: string;
  /** When a resource gets its own page, set its address here and the hub links to it instead of the PDF. */
  page?: string;
  /** Cover image for featured resources. */
  cover?: string;
  /** Shown first, as a cover, at the top of the hub. */
  featured?: boolean;
  /** false keeps internal documents (position descriptions and the like) out of the public hub. */
  hub?: boolean;
};

export type Entry = PageEntry | StoryEntry | TeamEntry;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

export function normaliseUrl(url: string) {
  let u = url.replace(/^https?:\/\/(www\.)?kuc\.org\.au/, "");
  if (!u.startsWith("/")) u = "/" + u;
  if (!u.endsWith("/")) u += "/";
  return u.toLowerCase();
}

function read(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { data: data as Record<string, unknown>, body: content.trim() };
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const arr = (v: unknown) => (Array.isArray(v) ? v.map(String) : typeof v === "string" ? [v] : []);
const dateStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : str(v) ?? "");

let cache: { entries: Entry[]; byUrl: Map<string, Entry> } | null = null;

function load() {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const entries: Entry[] = [];

  for (const file of walk(path.join(ROOT, "pages"))) {
    const { data, body } = read(file);
    const url = str(data.url);
    if (!url) continue;
    entries.push({
      kind: "page",
      url: normaliseUrl(url),
      title: str(data.title) ?? "Untitled",
      titleAccent: str(data.titleAccent),
      seoTitle: str(data.seoTitle),
      description: str(data.description),
      eyebrow: str(data.eyebrow),
      intro: str(data.intro),
      heroImage: str(data.heroImage),
      heroAlt: str(data.heroAlt),
      section: (str(data.section) as Section) ?? "other",
      template: (str(data.template) as Template) ?? "page",
      cta: (str(data.cta) as CtaKey | "none") ?? "donate",
      related: arr(data.related).map(normaliseUrl),
      status: (str(data.status) as PageEntry["status"]) ?? "live",
      redirectTo: str(data.redirectTo),
      order: typeof data.order === "number" ? data.order : undefined,
      form: str(data.form) && str(data.form) !== "none" ? (str(data.form) as FormKind) : undefined,
      sections: Array.isArray(data.sections) ? (data.sections as PageSection[]) : undefined,
      heroStyle: str(data.heroStyle) as PageEntry["heroStyle"],
      actions: Array.isArray(data.actions) ? (data.actions as Button[]) : undefined,
      noindex: data.noindex === true,
      body,
      file,
    });
  }

  for (const file of walk(path.join(ROOT, "stories"))) {
    const { data, body } = read(file);
    const url = str(data.url);
    if (!url) continue;
    entries.push({
      kind: "story",
      url: normaliseUrl(url),
      title: str(data.title) ?? "Untitled",
      description: str(data.description),
      date: dateStr(data.date),
      categories: arr(data.categories),
      program: str(data.program),
      image: str(data.image),
      imageAlt: str(data.imageAlt),
      excerpt: str(data.excerpt),
      cta: (str(data.cta) as CtaKey | "none") ?? "donate",
      body,
      file,
    });
  }

  for (const file of walk(path.join(ROOT, "team"))) {
    const { data, body } = read(file);
    const url = str(data.url);
    if (!url) continue;
    entries.push({
      kind: "team",
      url: normaliseUrl(url),
      name: str(data.name) ?? "Team member",
      role: str(data.role),
      group: str(data.group),
      image: str(data.image),
      order: typeof data.order === "number" ? data.order : undefined,
      description: str(data.description),
      body,
      file,
    });
  }

  const byUrl = new Map(entries.map((e) => [e.url, e]));
  cache = { entries, byUrl };
  return cache;
}

export const allEntries = () => load().entries;
export const getEntry = (url: string) => load().byUrl.get(normaliseUrl(url));

export const livePages = () =>
  allEntries().filter((e): e is PageEntry => e.kind === "page" && e.status === "live");

export const stories = () =>
  allEntries()
    .filter((e): e is StoryEntry => e.kind === "story")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export const team = () =>
  allEntries()
    .filter((e): e is TeamEntry => e.kind === "team")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));

export function resources(): Resource[] {
  const file = path.join(ROOT, "resources.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as Resource[];
}

/** Pages that live under a given path, for section landing pages. */
export const childrenOf = (url: string) => {
  const base = normaliseUrl(url);
  return livePages()
    .filter((p) => p.url !== base && p.url.startsWith(base) && p.url.slice(base.length).split("/").filter(Boolean).length === 1)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));
};

/** Redirects for merged and retired pages, used by next.config.ts. */
export const pageRedirects = () =>
  allEntries()
    .filter((e): e is PageEntry => e.kind === "page" && e.status !== "live" && !!e.redirectTo)
    .map((p) => ({ source: p.url, destination: normaliseUrl(p.redirectTo!) }));

/** Markdown to HTML, with old kuc.org.au links turned into site links. */
const md = new Marked({ gfm: true, breaks: false });
md.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const internal = /^https?:\/\/(www\.)?kuc\.org\.au(\/|$)/.test(href) && !/\/wp-content\//.test(href);
      const target = internal ? normaliseUrl(href.split("#")[0]) + (href.includes("#") ? "#" + href.split("#")[1] : "") : href;
      const external = /^https?:/.test(target);
      const pdf = /\.pdf($|\?)/i.test(target);
      return `<a href="${target}"${title ? ` title="${title}"` : ""}${external ? ' target="_blank" rel="noopener"' : ""}${pdf ? ' data-file="pdf"' : ""}>${text}</a>`;
    },
    image({ href, text }) {
      return `<img src="${href}" alt="${text ?? ""}" loading="lazy" />`;
    },
  },
});

export const renderMarkdown = (body: string) => md.parse(body, { async: false }) as string;

/** Inline Markdown (bold, italics, links) for titles and list items. */
export const renderInline = (text: string) => md.parseInline(text, { async: false }) as string;

/** First image in a body, used as a fallback hero or card photo. */
export const firstImage = (body: string) => body.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];
