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

## Homepage prototype (this repo)

A working prototype of the new kuc.org.au homepage for Pathway 2, built from the design in the deck "Kids Under Cover: The case for an AI native website" (slides 22 to 24). Next.js 15 (App Router), TypeScript, CSS Modules. No CMS yet.

### Where things live

- `content/home.ts`: every word, link, number and photo on the homepage. Most edit requests ("change the headline", "swap the Village 21 photo", "add a sixth intent") are changes to this file only.
- `app/page.tsx`: the order of sections. Reorder or remove sections here.
- `components/<Section>.tsx` + `components/<Section>.module.css`: one file pair per section (Header, Hero, Assistant, ImpactIntro, Programs, Neighbourhood, WaysToSupport, Target450, Stories, Footer, MobileDonateBar).
- `components/icons.tsx`: icons and the hand drawn illustrations (home and studio, Target450 print, drawn car).
- `app/globals.css`: design tokens (colours, fonts, radius, paper grain) and shared classes (`.sheet`, `.sheet-stack`, `.print`, `.ring`, `.brush`, `.serif`, `.btn`).
- `app/api/assistant/route.ts` + `lib/assistant.ts`: the AI front door. Without `ANTHROPIC_API_KEY` it answers from the intents and keywords in `content/home.ts`. With a key it asks Claude, limited to facts built from `content/home.ts`.
- `public/images/`: real KUC photos and the logo.

### Design system (from the deck)

- Fonts: Rubik 800 for headlines, Figtree for body, Fraunces italic for accent words. The deck uses these rather than Inter; switch in `globals.css` if KUC wants Inter.
- Colours: ink `#1F1D19`, paper `#F6F3EC`, sun `#FFD520` (the deck's yellow; brand yellow is `#F6D24C`).
- Paper craft feel: grain texture, layered sheets, printed photos with white borders and a slight tilt, brush labels, torn edges.
- Mobile: hero text sits under the photo, programs scroll sideways, frosted donate bar fixed to the bottom.

### Editing rules

- Keep copy in `content/home.ts`, not hard coded in components.
- Values marked `CONFIRM` in `content/home.ts` still need checking with KUC (exact page URLs, Target450 progress, some photos).
- Run `npm run build` before committing. Check the page at 390px and 1440px wide with no sideways scroll.
