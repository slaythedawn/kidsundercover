# Rebuilding a page from sections

How to turn a migrated page (one long Markdown body) into a designed page built from section templates. Used for every page on the site.

## Read first

- `lib/sections.ts`: every section type and field (S02 to S22). This is the spec.
- `content/design.ts`: one real example of each section, as rendered on `/design/sections/`.
- `docs/MIGRATION.md`: copy rules and front matter.
- Finished examples to copy the style of:
  - `content/pages/our-programs/studio-program/index.md` (program page)
  - `content/pages/our-impact/the-facts-and-statistics-on-youth-homelessness.md` (facts page)
  - `content/pages/get-involved/donate-your-car/index.md` (giving hub)
  - `content/pages/get-involved/donate.md` and `content/pages/regular-donation.md` (donation pages)

## What to do with each page

1. Read the page's current body and front matter.
2. Plan the page as sections, top to bottom, using the page templates at the bottom of `content/design.ts` as a guide (program page, facts page, giving hub, basic page).
3. Move every piece of the body into a section. When done, the Markdown body after the front matter must be empty.
4. Keep the existing front matter fields (`url`, `title`, `seoTitle`, `description`, `section`, `cta`, `related`, `status`, `order`, `form`). Add `sections:`, and `heroImage`/`heroAlt` if the page has none (see Images).

## Copy rules (strict)

- Keep KUC's words. Body text, quotes, numbers, names and dates must come from the page as it is now. You may shorten a long paragraph by cutting sentences, but never add facts, figures, quotes, promises or claims that aren't there.
- You may write short section headings, eyebrows and button labels so the layout reads well. Keep them plain and true to the copy beneath.
- Australian spelling. No emojis. No em or en dashes as punctuation; use commas or full stops.
- Links: keep every link from the original somewhere on the page. Internal links can be written as relative paths (`/about/`).
- Lists of things become `features`, `checklist`, `steps` or tick `points` on a `split`, not long bullet lists in a body.
- Questions and answers become a `faq` section.
- Contact details or "how to apply" become a `callout`.
- PDFs linked on the page stay as links in the relevant section (a `callout` or `split` button), and are already in the resource hub.
- Legal text (privacy, terms) uses `text` sections: one per main heading.

## Layout rules

- Never a photo full width between headings. Every photo sits in a section: `split` (beside copy), `features` (on a card), `facts`, `quote`, `callout`, `gallery`.
- Alternate `flip: true` on consecutive `split` sections so photos swap sides.
- Vary `tone` for rhythm (`card` for alternate sections; at most one `sun` and one `ink` band per page).
- Long pages (6 or more sections) start with `- type: jump` and give the main sections an `id` and short `nav` label.
- Use a `lead` near the top when the page has one strong opening sentence.
- Use a `quote` section for the strongest quote on the page, if there is one.
- End with the right giving ask through the page's existing `cta` (the template adds it). Don't add an `ask` section at the end as well.
- Three to nine sections is typical. Don't pad.

## Images

- Every image must be in `media/images.json` (the processed set). Use the original `https://www.kuc.org.au/wp-content/uploads/...` address as the key; the site swaps in the processed file. `node scripts/check-content.mjs` fails if an image isn't there.
- Look at an image before using it: the processed file is at `public` + the entry's `src` (for example `public/media/2024/02/studio-program-montage-3.jpg`). Check `kind`: `photo` is fine anywhere; `graphic` (logos, report covers, infographics, badges) only goes in `features`, `callout` or `split` where it's shown whole, never as `heroImage`.
- Prefer the images already on the page. If the page has no hero image, choose a relevant photo from `media/images.json` (look at it first). The local photos in `public/images/` (`/images/pair.jpg`, `/images/studios.jpg`, `/images/handover.jpg`, `/images/village.jpg`, `/images/junior.jpg`, `/images/holly.jpg`, `/images/mast.jpg`) can also be used.
- Never place a photo next to a named person's story or quote unless the photo is of that person (from that person's own page or story). A random photo beside "Rachel's story" says it's Rachel. Use a text-only section instead.
- Write real `heroAlt` and `imageAlt` text when you can see what the photo shows. Don't name people unless the page names them for that photo.

## Check your work

- Run `node scripts/check-content.mjs` after editing. It must print nothing and exit 0.
- Do not run `npm run build` (other people are building at the same time). Do not commit.
- Re-read each finished file once against the original body: nothing lost, nothing invented.
