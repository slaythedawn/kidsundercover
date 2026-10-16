import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allEntries,
  childrenOf,
  firstImage,
  getEntry,
  renderMarkdown,
  resources,
  stories,
  team,
  type PageEntry,
  type StoryEntry,
  type TeamEntry,
} from "@/lib/content";
import { links, nav } from "@/content/site";
import PageHero from "@/components/page/PageHero";
import Prose from "@/components/page/Prose";
import DonateBand from "@/components/page/DonateBand";
import CardGrid, { type Card } from "@/components/page/CardGrid";
import StoryIndex from "@/components/page/StoryIndex";
import Sections from "@/components/sections/Sections";
import ResourceHub from "@/components/sections/ResourceHub";
import GiveOptions from "@/components/page/GiveOptions";
import StorySidebar from "@/components/page/StorySidebar";
import FormBlock from "@/components/page/FormBlock";
import type { Crumb } from "@/components/page/Breadcrumbs";
import { media } from "@/lib/media";
import s from "./page.module.css";

type Params = { slug: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return allEntries()
    .filter((e) => e.url !== "/" && (e.kind !== "page" || e.status === "live"))
    .map((e) => ({ slug: e.url.split("/").filter(Boolean) }));
}

const urlOf = (slug: string[]) => "/" + slug.map(decodeURIComponent).join("/") + "/";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = getEntry(urlOf((await params).slug));
  if (!entry) return {};
  const title = entry.kind === "team" ? entry.name : entry.kind === "page" ? entry.seoTitle ?? entry.title : entry.title;
  const image = entry.kind === "story" ? entry.image : entry.kind === "page" ? entry.heroImage : entry.image;
  const description = entry.description ?? (entry.kind === "story" ? entry.excerpt : entry.kind === "page" ? entry.intro : entry.role);
  return {
    title,
    description,
    alternates: { canonical: entry.url },
    robots: entry.kind === "page" && entry.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title, description, images: image ? [image] : undefined, type: entry.kind === "story" ? "article" : "website" },
  };
}

/** Breadcrumbs from the URL, using page titles where we have them. */
function crumbsFor(url: string, current: string): Crumb[] {
  const parts = url.split("/").filter(Boolean);
  const out: Crumb[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    const href = "/" + parts.slice(0, i + 1).join("/") + "/";
    const e = getEntry(href);
    if (e && e.kind === "page") out.push({ label: e.title, href });
  }
  out.push({ label: current, href: url });
  return out;
}

const formatDate = (d: string) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "";

const storyCard = (st: StoryEntry): Card => ({
  title: st.title,
  href: st.url,
  image: st.image ?? firstImage(st.body),
  tag: st.categories[0],
  text: st.excerpt,
});

const pageCard = (p: PageEntry): Card => ({
  title: p.title,
  href: p.url,
  image: p.heroImage ?? firstImage(p.body),
  text: p.intro ?? p.description,
});

export default async function Page({ params }: { params: Promise<Params> }) {
  const url = urlOf((await params).slug);
  const entry = getEntry(url);
  if (!entry || (entry.kind === "page" && entry.status !== "live")) notFound();

  if (entry.kind === "story") return <StoryPage story={entry} />;
  if (entry.kind === "team") return <TeamPage person={entry} />;
  return <ContentPage page={entry} />;
}

function ContentPage({ page }: { page: PageEntry }) {
  const html = renderMarkdown(page.body);
  const crumbs = crumbsFor(page.url, page.title);
  const kids = childrenOf(page.url);
  const related = page.related.map(getEntry).filter((e): e is PageEntry => !!e && e.kind === "page");
  const navGroup = nav.find((g) => page.url.startsWith(g.href));

  const isStories = page.url === links.stories;
  const isMedia = page.url === links.mediaCentre;
  const isTeam = page.url === links.ourTeam;
  const isLibrary = page.url === links.research || page.url === links.publications;
  const isGive = page.template === "give" || page.url === links.waysToGive;

  const has = (type: string) => !!page.sections?.some((x) => x.type === type);
  const heroActions = has("donate") ? undefined : page.actions ?? (
    page.section === "give" && !isGive
      ? [{ label: "Donate now", href: links.donate }]
      : page.section === "work"
        ? [{ label: "Fund this work", href: links.donate }, { label: "Ways to give", href: links.waysToGive, variant: "ghost" as const }]
        : undefined);

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow ?? navGroup?.label}
        title={page.title}
        intro={page.intro}
        image={page.heroImage}
        imageAlt={page.heroAlt}
        crumbs={crumbs}
        actions={heroActions}
        variant={page.heroStyle}
        accent={page.titleAccent}
      />

      {isGive && <GiveOptions />}

      {page.sections && <Sections sections={page.sections} pageUrl={page.url} />}

      {html && !isStories && (
        <section className={s.body}>
          <div className="wrap">
            <Prose html={html} />
          </div>
        </section>
      )}

      {page.form && <FormBlock kind={page.form} />}

      {isStories && (
        <StoryIndex
          stories={stories().map((st) => {
            const c = storyCard(st);
            return { title: c.title, href: c.href, text: c.text, img: c.image ? media(c.image) : undefined, date: st.date, categories: st.categories };
          })}
          intro={html}
        />
      )}

      {isMedia && (
        <CardGrid
          title="Media releases"
          cards={stories().filter((st) => st.categories.some((c) => /media/i.test(c))).map((st) => ({ ...storyCard(st), tag: formatDate(st.date) }))}
        />
      )}

      {isTeam &&
        ["Executive leadership team", "Board of directors"].map((group) => (
          <CardGrid
            key={group}
            title={group.charAt(0) + group.slice(1)}
            cards={team().filter((t) => t.group === group).map((t) => ({ title: t.name, href: t.url, image: t.image, text: t.role }))}
          />
        ))}

      {isLibrary && !has("resources") && (
        <section className="section" style={{ paddingTop: 16 }} aria-label="Reports and resources">
          <div className="wrap">
            <div className="section-head"><h2>Reports and resources</h2></div>
            <ResourceHub items={resources()} />
          </div>
        </section>
      )}

      {kids.length > 0 && !isStories && !page.sections && <CardGrid title={`More in ${page.title}`} cards={kids.map(pageCard)} />}

      {related.length > 0 && <CardGrid title="Keep exploring" cards={related.map(pageCard)} />}

      {page.cta !== "none" && page.sections?.at(-1)?.type !== "ask" && <DonateBand cta={page.cta} />}
    </>
  );
}

function StoryPage({ story }: { story: StoryEntry }) {
  const html = renderMarkdown(story.body);
  const image = story.image ?? firstImage(story.body);
  const all = stories();
  const more = all
    .filter((x) => x.url !== story.url && (story.program ? x.program === story.program : true))
    .slice(0, 3);
  const moreCards = (more.length ? more : all.filter((x) => x.url !== story.url).slice(0, 3)).map(storyCard);
  const isMedia = story.categories.some((c) => /media/i.test(c));

  return (
    <>
      <PageHero
        eyebrow={story.categories[0] ?? "Story"}
        title={story.title}
        image={image}
        imageAlt={story.imageAlt}
        crumbs={[isMedia ? { label: "Media centre", href: links.mediaCentre } : { label: "Stories", href: links.stories }, { label: story.title, href: story.url }]}
        meta={story.date ? <time dateTime={story.date}>{formatDate(story.date)}</time> : undefined}
      />
      <section className={s.body}>
        <div className={`wrap ${s.article}`}>
          <Prose html={html} />
          <StorySidebar cta={story.cta === "none" ? "donate" : story.cta} />
        </div>
      </section>
      <CardGrid title="Read next" cards={moreCards} more={{ label: "All stories", href: links.stories }} />
      {story.cta !== "none" && <DonateBand cta={story.cta} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": isMedia ? "NewsArticle" : "Article",
            headline: story.title,
            datePublished: story.date || undefined,
            image: image ? [image] : undefined,
            publisher: { "@type": "NGO", name: "Kids Under Cover", url: "https://www.kuc.org.au" },
          }),
        }}
      />
    </>
  );
}

function TeamPage({ person }: { person: TeamEntry }) {
  const html = renderMarkdown(person.body);
  return (
    <>
      <PageHero
        eyebrow={person.group ?? "Our team"}
        title={person.name}
        intro={person.role}
        image={person.image}
        imageAlt={person.name}
        crumbs={[{ label: "About", href: links.about }, { label: "Our team", href: links.ourTeam }, { label: person.name, href: person.url }]}
      />
      {html && (
        <section className={s.body}>
          <div className="wrap">
            <Prose html={html} />
          </div>
        </section>
      )}
      <CardGrid
        title="More of the team"
        cards={team().filter((t) => t.url !== person.url).slice(0, 4).map((t) => ({ title: t.name, href: t.url, image: t.image, text: t.role }))}
        more={{ label: "Whole team", href: links.ourTeam }}
      />
      <DonateBand cta="donate" />
    </>
  );
}
