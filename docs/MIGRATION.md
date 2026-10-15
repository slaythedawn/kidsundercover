# Content migration rules

How each page of kuc.org.au becomes a content file in this repo. Used by the
people (and agents) moving content across, and kept for when new pages are added.

## Where files go

| Live content | File | Example |
|---|---|---|
| Page | `content/pages/<path>.md` (mirror the URL path; a page with children uses `<path>/index.md`) | `content/pages/our-programs/studio-program/index.md` |
| Story or news post | `content/stories/<slug>.md` | `content/stories/meeting-junior.md` |
| Media release | `content/stories/media-<slug>.md` | `content/stories/media-our-1000th-studio.md` |
| Team profile | `content/team/<slug>.md` | `content/team/stephen-nash.md` |
| PDF found on a page | add to a JSON array in `content/_resources/<batch>.json` | see below |

Every file sets `url:` to the exact live path (for example `/our-programs/studio-program/`). The site serves the file at that address, so rankings carry over.

## Copy rules

- Keep KUC's words. Copy the real text across; fix only obvious typos and broken formatting. Never invent facts, figures, quotes, names or stories.
- Australian spelling, no emojis. Do not add em dashes. Where the original uses an en or em dash as a pause, a comma is fine.
- Remove page furniture: menus, "Search Kids Under Cover", repeated carousels (keep each card once), cookie text, share buttons, tracking pixel images (any image not on `kuc.org.au/wp-content/uploads/`), icon images (`*-icon.png`), and "Read more" links that only repeat a heading.
- Markdown only: `##` and `###` headings (the page title is the H1, so never use `#`), paragraphs, lists, `>` quotes, tables, `![alt](url)` images.
- Images stay as absolute `https://www.kuc.org.au/wp-content/uploads/...` URLs. Prefer the largest size in the URL (drop `-640x480` style suffixes only if you are sure the original exists; otherwise leave as is). Write real alt text when the page makes it clear who or what is shown, otherwise leave alt empty.
- Links to other kuc.org.au pages stay absolute; the site rewrites them. Strip `utm_`, `_ga` and `_gl` parameters from every link.
- Embedded forms (Gravity Forms, Salesforce widgets): remove the form markup and set `form:` in front matter instead (`newsletter`, `contact`, `scholarship`, `studio`, `fundraising`, `donate`, `none`). Keep any text that explains the form.
- YouTube embeds: keep as a plain link on its own line, `[Watch the video](https://www.youtube.com/watch?v=ID)`.

## Front matter

### Pages

```yaml
---
url: /our-programs/studio-program/
title: Studio Program            # H1, from the live page
seoTitle: ...                    # live <title> minus " - Kids Under Cover", only if different from title
description: ...                 # live meta description, verbatim
eyebrow: Our work                # optional short label
intro: ...                       # first real sentence or two from the page, verbatim
heroImage: https://www.kuc.org.au/wp-content/uploads/...   # main photo of the page, if any
heroAlt: ...
section: work                    # work | impact | give | about | support | legal | campaign | other
cta: donate                      # donate | monthly | car | bequest | partner | fundraise | support | scholarship | target450 | none
form: none
related: [/get-involved/donate-your-car/]   # 2 to 4 live URLs that a reader of this page should see next
order: 1                         # optional sort order among siblings
status: live                     # live | merged | retired
redirectTo: /about/              # only when status is merged or retired
---
```

Do not repeat the intro as the first paragraph of the body.

### Stories and media releases

```yaml
---
url: /meeting-junior/
title: Meeting Junior
description: ...                 # live meta description
date: 2022-03-01                 # datePublished from the page's JSON-LD
categories: [News]               # live categories; media releases use [Media releases]
program: scholarships            # studio | village21 | scholarships | car | bequest | research | advocacy | supporters | general
image: https://www.kuc.org.au/wp-content/uploads/...
imageAlt: ...
excerpt: ...                     # first sentence or two, verbatim
cta: scholarship                 # the ask that fits the story (car stories use car, bequest stories use bequest)
---
```

### Team

```yaml
---
url: /team/stephen-nash/
name: Stephen Nash
role: Chief Executive Officer    # verbatim from the live profile
group: Executive leadership team # Board of directors | Executive leadership team
image: https://www.kuc.org.au/wp-content/uploads/...
order: 1
---
Bio text.
```

## Keep, merge or retire

Default to `status: live`. Use `merged` or `retired` (with `redirectTo`) only for:

- duplicates and test pages (for example `/get-involved/bequests-2/`, `/donate-your-car-test-page/`, `/kids-under-cover-scholarship-spending-guide/`, `/news/justice-funding/`)
- utility pages with no reader content (for example `/donate-button/`)
- appeals and events that are clearly over (a dated appeal or a finished event). Redirect to the closest evergreen page, usually `/get-involved/` or the program page.

Category, tag, author, `team-category` and `channel` archive pages get no file; the site redirects them.

## Section and ask by area

| URL starts with | section | default cta |
|---|---|---|
| `/our-programs/` | work | donate (scholarships pages use scholarship) |
| `/our-programs/resources-for-*`, `/get-support/` | support | support |
| `/our-impact/` | impact | donate (`research-and-resources` uses monthly) |
| `/get-involved/donate-your-car*` | give | car |
| `/get-involved/bequests/` | give | bequest |
| `/get-involved/corporate-*`, `/partner-donations/` | give | partner |
| `/get-involved/community-fundraising/` | give | fundraise |
| other `/get-involved/`, `/regular-donation/`, `/target450/` | give | donate or monthly |
| `/about/` | about | donate |
| privacy and terms | legal | none |

## PDFs

Collect every PDF link (`.pdf`) found on a page into `content/_resources/<batch>.json`:

```json
[{ "title": "Annual Report 2023", "url": "https://www.kuc.org.au/wp-content/uploads/....pdf", "category": "Annual reports", "year": "2023", "foundOn": "/our-impact/publications/" }]
```

Categories: `Annual reports`, `Research`, `Impact reports`, `Policies`, `Guides and forms`, `Newsletters`, `Other`. Use the link text as the title, tidied.
