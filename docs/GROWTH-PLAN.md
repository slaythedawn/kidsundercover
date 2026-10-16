# Growing donations and search visibility

A review of where the new site can raise more money and be found by more people, what has been built, and what's next. Ahrefs data is for Australia, October 2026. See `docs/SEO.md` for the keyword research and `docs/INTEGRATIONS.md` for how donations are processed.

## Donations

### Done

1. **Every Donate button now goes through our donation page.** The header, footer, phone bar, homepage and the closing ask on every page used to send people straight to Giveasy. They now land on `/get-involved/donate/` first, where people:
   - see what each amount does, in KUC's own words
   - can switch to monthly
   - keep their campaign tags (UTM), which the page passes on to Giveasy and records as a `begin_checkout` event

   This was the single biggest gap: almost no gift could be traced to its campaign.
2. **"Make it monthly?" prompt** on one-off gifts, with KUC's own reason ("Regular gifts help us make longer term plans"). A monthly donor gives many times more over a year than a one-off donor.
3. **Christmas appeal page** at `/christmas-appeal/`, built from KUC's 2025 appeal (Rachel's story). The address stays the same every year, so it builds search ranking ("christmas donation" 200 searches a month, "donate for christmas" 100).
4. **Workplace giving page** at `/get-involved/workplace-giving/` ("workplace giving" 350 a month, difficulty 0), in the Ways to give menu and linked from Donate and Regular giving.
5. **A giving ask partway down the facts page.** It's the site's busiest page from search, and most readers never reach the bottom.
6. **Car removal pages** (`/car-removal/`, `/car-removal/melbourne/`) bring people searching to get rid of a car into the Donate Your Car journey.
7. **Bequests:** the "Gifts in Wills guide" button linked back to its own page. It now goes to `/get-involved/bequests/gifts-in-wills-guide/`, the Promise For Kids booklet as a page (CEO letter, supporters' stories, KUC's promise to people leaving a gift, and the advisor's contact).

### Next

| Priority | What | Why | Needs |
|---|---|---|---|
| 1 | Fix tracking: one GA4 install, cross-domain linker for Giveasy and Salesforce | Without it, nobody can see which pages and campaigns raise money | GTM and GA4 access from KUC |
| 2 | Giveasy amount pre-fill and monthly gifts in Giveasy | The amount people choose on our form carries through; monthly giving in one place | Giveasy settings |
| 3 | EOFY tax appeal page (May and June) at a fixed address, like Christmas | Tax time is the biggest giving season; "tax deductible donations australia" has a traffic potential of 4,600 | KUC's appeal story |
| 4 | Native car donation form | Replace the AngularJS Salesforce form; see where people drop off | The current form's fields, Salesforce access |
| 5 | Gifts in memory | People search for it (30 a month), and it suits bequest supporters | KUC to confirm they accept them |
| 6 | Seasonal feature card in the Ways to give menu (Christmas in November and December, tax in May and June) | Puts the live appeal in front of everyone who opens the menu | Content |

## Search visibility

### Done

1. **New title tags and meta descriptions on every page**, each matched to a real search term (`scripts/seo-titles.mjs`). Titles no longer repeat the brand twice.
2. **Structured data** on every page: KUC as a charity (NGO, ABN, founder, donate action), plus FAQ, Article, Breadcrumb, Person, Report and Service records where they fit.
3. **Alt text for 91 images** that had none, written after looking at each one.
4. **Two truncated addresses ranking in Google** (`/Our`, `/Get`) now redirect to the right pages.
5. **Email and event pages hidden from search** (partner donations, silent auction, Return to Give, the mobile pod welcome pack), so search engines focus on the pages that matter.
6. **PDF reports turned into pages** (see below). Text inside PDFs is hard for search engines to rank, and people rarely open them. Text inside PDFs is hard for search engines to rank, and people rarely open them.

### Next

| Searches a month | Opportunity | Difficulty | Needs |
|---|---|---|---|
| 1,200 | "fundraising ideas": a page of real ideas | 0 | KUC's community fundraising toolkit |
| 9,100 | "sell my car": a "sell or donate?" guide | 5 | Writing |
| 800 to 1,400 | Car removal pages for Sydney, Perth, Brisbane, Adelaide | 49 to 62 | Build after Melbourne ranks |
| 300 | "charities to donate to" | 0 | Content on why give to KUC |
| 200 | "kinship care": a guide for kinship carers | 1 | KUC to confirm what support they give carers |
| - | Publish one story a month | - | Publishing fell from 51 updates in 2023 to 3 in 2026 |
| - | Google Search Console | - | Access from KUC, to see real searches and submit the sitemap |

## Reports and PDFs

How each of the 38 public PDFs in the resource hub is handled:

| Type | Handling |
|---|---|
| Latest annual impact statements, strategic plan, Reconciliation Action Plan, the Promise For Kids bequest guide | Turned into pages, with the PDF as a download. The hub links to the page. Done: `/our-impact/publications/2025-annual-impact-statement/`, `/our-impact/publications/2024-annual-impact-statement/`, `/about/strategic-plan/`, `/about/reconciliation-action-plan/`, `/get-involved/bequests/gifts-in-wills-guide/`. |
| Social Return on Investment report (image only, now read with OCR) | Next: its findings can strengthen the existing research page. |
| Research reports and briefs | Already pages (the research section). |
| Forms and legal documents (statutory declaration, direct debit agreement, ACCC guide) | Stay as PDFs: people need to print or sign them. |
| Older annual reports (2017 to 2023) and 11 Undercover News issues | Stay as downloads in the hub. Candidates for later: past newsletters hold stories that could become story pages. |
| Small how-to sheets (receipt upload, mobile pod tips) | Fold into the page they belong to. |

## How PDFs become pages

The media sync (`.github/workflows/fetch-media.yml`) downloads every PDF in the hub, extracts its text (with OCR for image-only PDFs), page count and a cover image, and commits only those (`media/pdf-text/`, `media/pdf-info.json`, `public/media/pdf-covers/`), never the PDFs. A report page uses the cover as its hero and the report's own words and figures, with the PDF as a download. Set `page` on the resource in `content/resources.json` and the hub links to the page instead of the PDF.
