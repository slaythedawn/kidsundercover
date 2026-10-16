# Kids Under Cover website work

Context for Claude Code sessions on the Kids Under Cover (KUC) website project. Read this before starting any task.

## Who's who

- **Josh Peacock** (joshuapcck@gmail.com): leads the work, agency side.
- **Juan Pablo de la Pava** (jp.delapava@gmail.com): working with Josh.
- **Bianca Millar**: KUC Partnerships and Growth Manager. Main client contact.
- **Halfdome** (Julien Walker, Stoja Trkulja) and **Kath** (unltd.org.au) are also on the client side thread.
- **Itomic** is KUC's incumbent web agency. We are taking the work over from them, so never contact Itomic or assume they will help. Any access or changes go through KUC.

## The client

Kids Under Cover is an Australian charity that builds studios for young people at risk of homelessness. Main site: kuc.org.au (WordPress).

## Two pathways

### Pathway 1: Donate Your Car (DYC) landing pages and tracking fix

Four mobile first landing pages, each matched to a visitor intent level:

1. **Evergreen hub**: the full story. Hero with two CTAs, trust strip, anchor links, how it works, what we accept, tax, impact, donor stories, FAQs, closing CTA.
2. **Awareness**: emotion led. Young person's story, driveway to auction to home, video slot, donor quote, impact numbers. Main CTA goes to Consideration, not straight to the form.
3. **Consideration**: built to remove doubts before donating.
4. **High intent**: short, straight to the form.

All donation CTAs point to the Salesforce form: `https://kuc.my.salesforce-sites.com/Donateyourcar`

Plus tracking and tagging remediation (see Known issues).

### Pathway 2: AI native rebuild of the whole site

A proposal to rebuild all of kuc.org.au, not just DYC. Scope inventory from a sitemap crawl: 66 pages, 74 stories, 28 media releases, 13 team profiles, 79 PDFs, 6 external integrations (181 addresses in total), grouped as straightforward, needs care and complex.

## Known issues on the current site

- GA4 is installed twice (MonsterInsights plugin and GTM), so page views double count.
- Cross domain tracking between kuc.org.au and kuc.my.salesforce-sites.com is broken, so campaign source is lost at the form and donations show as direct.
- A custom UTM script in GTM is malformed.
- Stale `_ga` and `_gl` parameters are hardcoded into some DYC links.
- Dead Universal Analytics tags are still firing on the form page.
- The multi step donation form runs on AngularJS 1.6 (unsupported since 2022) and has no event tracking.

## Access and constraints

- Josh has Editor level WordPress access only, not Admin. Plugin installs and theme changes need KUC to action them.
- GA4 and GTM viewer access has been requested from KUC for both Josh and Juan.
- Ownership of the Salesforce donation form is not yet confirmed.
- Donations are split across several systems: Giveasy (main donations), a Salesforce NPSP widget (regular giving and fundraisers), the Salesforce car donation form, and Microsoft Forms (Studio Program applications).

## SEO context (Ahrefs audit)

- Domain Rating 51, but organic traffic is down about 53% from a May 2025 peak (roughly 1,957 to 915 monthly visits).
- Only 17 of about 180 sitemap pages rank in Australia.
- Publishing has stalled: 51 blog updates in 2023 versus 3 in 2026.
- KUC already ranks first for "car donation" (about 700 searches a month). The bigger opportunity is "car removal" and "scrap car" terms (15,000+ a month).

## Brand

- KUC yellow `#F6D24C` with black. Inter typeface.
- Use real KUC photos, copy and brand assets from the live site. Don't invent stats or donor stories.

## Working style

- Australian spelling throughout (organisation, colour, optimise).
- Plain, direct, everyday language in all copy and client facing text.
- No emojis. No em dashes or other dash heavy phrasing that reads as AI written.
- Mobile first for every page and component.
- Deliver complete, ready to use outputs rather than partial snippets.

## Website prototype (this repo)

A working rebuild of the whole kuc.org.au site for Pathway 2, in the design from the deck "Kids Under Cover: The case for an AI native website" (slides 22 to 24). Next.js 15 (App Router), TypeScript, CSS Modules, content in Markdown. No CMS yet.

### Where things live

- `content/site.ts`: links, the main menu (four groups plus Stories), footer, and the giving asks (`ctas`) that close every page. Change the menu here.
- `content/home.ts`: every word, link, number and photo on the homepage.
- `content/pages/**.md`: every page migrated from kuc.org.au, one file each. Front matter `url` is the live address, so rankings carry over. See `docs/MIGRATION.md` for every front matter field.
- `content/stories/*.md`: the 73 stories and news posts, plus the 28 media releases (`media-*.md`).
- `content/team/*.md`: team profiles. `content/resources.json`: every PDF, shown in the searchable library on Research and resources and Publications.
- `app/[...slug]/page.tsx`: the one template that renders every page, story and team profile, and adds the right extras by URL (story index, team grid, media releases, resource library, giving options).
- `lib/sections.ts` + `components/sections/*`: the section templates (S01 to S21) that pages are built from via `sections` in front matter. All shown for sign off at `/design/sections/` (content in `content/design.ts`). See `docs/MIGRATION.md` for how to build a page from sections.
- Pilot pages built from sections: Studio Program, Facts and stats, Publications, and the four Donate Your Car pages (`/get-involved/donate-your-car/` hub, `their-new-beginning/` awareness, `how-it-works/` consideration, `start/` high intent; the three campaign pages are `noindex`). Other pages still render their Markdown body until their template is signed off.
- SEO: `docs/SEO.md` (Ahrefs research and what was built), `scripts/seo-titles.mjs` (title tags and meta descriptions for every page; titles leave off the brand, the layout adds it), `lib/schema.tsx` (structured data). Car removal landing pages: `/car-removal/` and `/car-removal/melbourne/`.
- Images: `scripts/process-media.py` turns every KUC image into a web-ready file in `public/media` (circle and blob graphics rebuilt as clean photos, face-aware crops, graphics shown whole). Overrides in `media/overrides.json`. Components use `<Photo>`; content keeps the original kuc.org.au addresses.
- `components/page/*`: shared building blocks (PageHero, Prose, DonateBand, CardGrid, StoryIndex, StorySidebar, GiveOptions, ResourceLibrary, FormBlock).
- `components/*` (top level): header, footer and the homepage sections.
- `next.config.ts`: redirects. Pages marked `status: merged` or `retired` redirect to `redirectTo`; old category and tag archives redirect to Stories.
- `app/api/assistant/route.ts` + `lib/assistant.ts`: the AI front door.

### How the site is organised for giving

- Menu: Our work, Our impact, Ways to give, About, Stories. Every dropdown ends with a featured giving card. Donate and Donate your car sit in the header on every page; a frosted donate bar stays on screen on phones.
- Every page ends with a giving ask matched to its topic (`cta` in front matter): car stories ask for cars, scholarship pages for scholarships, bequest pages for gifts in wills.
- Every story has a sticky giving card beside it and "Read next" stories from the same program.
- The footer opens with a giving band and links every section.
- The homepage "Find your way" band links the deeper pages people search for (facts, research, support, bequests).

### Design system (from the deck)

- Fonts: Rubik 800 for headlines, Figtree for body, Fraunces italic for accent words. The deck uses these rather than Inter; switch in `globals.css` if KUC wants Inter.
- Colours: ink `#1F1D19`, paper `#F6F3EC`, sun `#FFD520` (the deck's yellow; brand yellow is `#F6D24C`).
- Paper craft feel: grain texture, layered sheets, printed photos with white borders and a slight tilt, brush labels, torn edges.
- Photos on inner pages load from KUC's current WordPress media library (`kuc.org.au/wp-content/uploads`). Before launch, copy them into this project or the new CMS.

### Editing rules

- Keep copy in content files, not hard coded in components.
- Values marked `CONFIRM` still need checking with KUC.
- Run `npm run build` before committing. Check pages at 390px and 1440px wide with no sideways scroll.
