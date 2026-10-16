# SEO plan and research

Ahrefs data for Australia, October 2026. Title tags and meta descriptions for every page live in `scripts/seo-titles.mjs` (run it to write them into each page's front matter). The site adds " | Kids Under Cover" to every title, so titles in front matter leave the brand off.

## Where KUC ranks today

Almost all organic traffic lands on two pages:

| Page | Top keyword | Searches a month | Position |
|---|---|---|---|
| Youth homelessness facts and stats | youth homelessness | 700 | 1 |
| | youth homelessness in australia | 150 | 1 |
| | homeless youth / homeless kids | 150 / 100 | 5 to 6 |
| Donate Your Car | donate your car | 200 | 1 |
| | donate my car / donate car to charity | 50 / 30 | 1 |
| Homepage | youth charity / youth charities australia | 80 / 60 | 3 |
| Ken Morgan, founder | ken morgan | 70 | 1 |

Two truncated addresses, `/Our` and `/Get`, were ranking in Google. They now redirect to the facts page and Donate Your Car (`next.config.ts`).

## Opportunities, and what was built for each

| Searches | Keyword | Difficulty | Built |
|---|---|---|---|
| 2,300 | car removal | 0 | New page `/car-removal/` |
| 800 | car removal melbourne | 0 | New page `/car-removal/melbourne/` |
| 600 | scrap car removal | 0 (traffic potential 16,000) | `/car-removal/` (title, headings, FAQ) |
| 600 | junk car removal | 2 | `/car-removal/` |
| 300 | old car removal | 0 (traffic potential 8,200) | `/car-removal/` |
| 200 | scrap car removal melbourne | 4 | `/car-removal/melbourne/` |
| 200 | gift in will | 0 | Bequests title: "Leave a Gift in Your Will" |
| 150 | tax deductible donation | 0 (traffic potential 4,600) | Donate title: "Donate, Tax Deductible Donation" |
| 150 | youth housing | 4 | Village 21 title: "Supported Youth Housing" |
| 100 | regular giving | 0 | Regular giving title |
| 600 | backyard studio | 0 | Studio Program title: "Backyard Studios for Youth" |
| 250 | overcrowding | 1 | Crowding, Risk and Homelessness study title |

The car removal pages are honest about limits: KUC can't take cars with significant damage, so they say a wrecker is the better option for those. They link to the hub, and the hub's FAQs link back.

## Next opportunities (not built yet)

- **City car removal pages** for Sydney (800 a month, difficulty 49), Perth (700, 59), Brisbane (1,400, 62) and Adelaide (450, 58). Harder than Melbourne, and each needs its real drop-off site and collection details. Build after Melbourne shows results.
- **"sell my car"** (9,100 a month, difficulty 5): a "sell or donate?" comparison page. Needs care so it stays useful to people who do want to sell.
- **"how to dispose of a car"** (40 a month, traffic potential 6,100): a short guide covering selling, wreckers, donating and deregistration.
- **Youth homelessness content:** the facts page ranks first. Keep its figures current every year (the 2026 Census and each new AIHW report), as that ranking is the site's biggest asset.
- **Publishing:** 51 posts in 2023 against 3 in 2026. One story a month from the Studio Program keeps the site fresh and builds links.

## Structured data

- Every page: KUC as an NGO (name, ABN, logo, founding year 1989, founder Ken Morgan, phone, social profiles, donate action), plus a WebSite record (`lib/schema.tsx`, `app/layout.tsx`).
- Breadcrumbs on every inner page. FAQ markup on every page with a questions section. Article and NewsArticle on stories and media releases. Person on team profiles. Report on research pages. Service on the car removal pages.

## Before launch

- Submit the new sitemap in Google Search Console and request indexing for the car removal pages.
- Keep every live address (done: pages keep their URLs, retired pages redirect).
- Connect Google Search Console to Ahrefs for real query data, then revisit titles after eight weeks.
