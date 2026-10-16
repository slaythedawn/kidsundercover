# Kids Under Cover site rebuild: structure and review list

The whole of kuc.org.au rebuilt in the homepage design, with the structure changed to send more visitors to giving. Every page, story, media release and team profile was copied from the live site in October 2026 and lives in `content/`.

## What was moved across

| Live content | On the live site | In the rebuild |
|---|---|---|
| Pages | 68 | 56 live plus a new Stories page, 13 redirected (duplicates, test pages, finished appeals) |
| Stories and news | 74 | 70 live, 4 not migrated (see below) |
| Media releases | 28 | 27 live, archive page redirected to the Media centre |
| Team profiles | 13 | 13 live, grouped into Executive leadership team and Board of directors |
| PDFs | 79 (estimate) | 41 found linked from pages, in one searchable library |

Every live address still works: kept pages keep their URL, and everything else redirects (see `next.config.ts` and the `redirectTo` front matter). Old category, tag, author and team category archives redirect to Stories or Our team.

## How the structure changed

**Before:** six menus with 30+ links, giving split across "Get involved" and a separate donation site, stories only reachable from one listing page, PDFs scattered across pages, and the facts page (the site's top search page) linked from almost nowhere.

**After:**

1. **Four menus plus Stories.** Our work, Our impact, Ways to give, About. Each dropdown ends with a featured giving card (Fund a studio, Target450, Donate your car).
2. **Giving is always one tap away.** Donate and Donate your car sit in the header on every page. On phones a frosted donate bar stays on screen. The footer opens with a giving band.
3. **Every page ends with an ask that fits it.** Car stories ask for cars, scholarship pages ask for scholarships, bequest stories ask for gifts in wills, research pages ask for monthly giving (set by `cta` in each file).
4. **Ways to give hub.** `/get-involved/` now leads with six giving options side by side before the original copy.
5. **Stories work harder.** Every story has a sticky giving card beside it and "Read next" stories from the same program. The Stories page has topic filters and search across all 70 stories.
6. **Search pages surfaced.** The homepage "Find your way" band, the Our impact menu and the 404 page all link the facts page, research and support. Breadcrumbs (with structured data) on every inner page.
7. **One resource library.** Research and resources and Publications both show every PDF in one searchable, filterable list.
8. **Built for search and AI answers.** Clean URLs, canonical tags, Open Graph, Article and BreadcrumbList structured data, an XML sitemap of all 180 or so addresses, and fast static pages.

## For KUC to review

### Content that could not be copied
These four stories loop on redirects on the live site, so the crawler only got a verification page. They currently redirect to Stories. Please send the text or fix the live pages so they can be copied:
- /corporate-collective-impact/
- /volunteer-week-leannes-story/
- /stress-space-and-school-life-before-and-after-a-studio/
- /a-new-life-in-the-law/

### Pages redirected in the rebuild (please confirm)
- /get-support/ was a thin copy of the programs list. It now redirects to Resources for young people, which the menu calls "Get support".
- /get-involved/bequests-2/, /kids-under-cover-scholarship-spending-guide/, /news/justice-funding/, /privacy-feedback/, /terms-conditions/: duplicates of other pages.
- /donate-your-car-test-page/, /donate-button/: test and utility pages.
- /kids-under-cover-2024-eofy-tax-appeal/, /winter/, /kids-under-cover-giving-day-faqs/, /atora-games-fundraiser/: finished appeals and events.

### Out of date or inconsistent on the live site (copied as is)
- /get-involved/donate/ is still the Christmas appeal ("Give the gift of extra space this Christmas").
- DFFH student scholarship page says applications are open; they closed on 21 August 2026. Scholarship pages mix 2025 and 2026 dates.
- Sarah Davies scholarship: "What am I not allowed to use the scholarship for?" is answered with what you can use it for.
- Ken Morgan is "AO" in one place and "OAM" in another.
- Nathaniel Popelianski's bio says "As the Chair of our Board"; Clare Gleghorn is listed as Chair.
- Charitable status page lists five "Further information" items with no links. The scholarship values table on the apply page is empty.
- Work with us lists a CEO vacancy.
- Townsville drop-off hours were garbled; read as Monday to Thursday 8am to 4pm, Friday 8am to 3.30pm.
- Resources for carers reuses the young people page's title and description.

### Missing details
- Stories with no publish date: /fostering-hope/, /nurturing-independence-at-village-21/, /the-call-for-a-collaborative-vision-to-address-youth-homelessness/, /vale-ken-morgan-oam/, and three media releases (Canberra Times repost, Homelessness Achievement Award, Youth Homelessness Matters Day).
- Stories and releases with no photo (13), including /sandis-story/ and /from-inner-strength-to-advocacy/.
- Virtual tour videos on Studio Program, Village 21 and Moorumbina Mongurnallin, the Village 21 investment video, and the drop-off locations map did not come through.
- Team headshots are the small 300 pixel versions.

### Before launch
- Photos load from KUC's WordPress media library. Copy them into the new CMS so the old site can be switched off.
- Forms (newsletter, contact, scholarship, studio referral, fundraising) are placeholders that link to the live forms. In the build they become native forms posting to Salesforce.
- Confirm the Giveasy and Salesforce donation links in `content/site.ts`.
- Light copy edits were made: obvious typos, dashes, broken links (NILS, a wrong Victorian Aboriginal Child Care Agency link, an old Village 21 link).

### Figures that disagree (please confirm one number for each)
- Studios built: the homepage says 675+; the 2019 media release celebrates the 1000th studio, and Sweet relief (2024) says over 600 in Victoria plus 18 in South Australia.
- Raised by Donate Your Car: the homepage says $20M+; the Donate Your Car page says over $23 million.
- Young people housed each night: around 1,000 in Victoria, updated January 2024. Is there a newer figure?

### Donate Your Car pages
- The "Have these handy" list on the high intent page needs checking against the Salesforce form fields (the form couldn't be reached from the build environment).
- The awareness, consideration and high intent pages are hidden from search (`noindex`) so they don't compete with the hub. Point paid campaigns at them with UTM tags.

### Found while rebuilding pages into sections (October 2026)
**Out of date**
- Scholarships: DFFH says "Applications now open" for 2027 but they closed 21 August 2026. Ken and Lenka Morgan and Sarah Davies say "Applications are open now" with 2025 forms and criteria. The apply page mixes 2026 eligibility with 2025 proof of enrolment and FAQs. The spending guide's receipt deadline is 1 September 2024. "35th year" on the Ken and Lenka page.
- Village 21: Shepparton onboarding "July/August 2026" has passed. Bairnsdale is "completed, onboarding" on one page and "Opening in 2026" on another. Moorumbina and Mobile Pod copy is still in future tense.
- About: "thirty four years", "nearly 35 years" and "over the 2023 financial year". Privacy policy last updated January 2019. Work with us roles were posted September 2026; check they're still open.
- Resources for young people and carers: Jobactive, Child Care Benefit, dese.gov.au and humanservices.gov.au links look out of date. Mobile Pod welcome pack PDFs have "DRAFT" in their file names.

**Inconsistent**
- Ken Morgan is OAM in some places and AO in others (About, Our story, Our supporters).
- Studios: "over 650" (About), "nearly 650" (Ken Morgan page), 675+ (homepage), 1000th studio (2019 release).
- Addresses: 383 Swan Street, Richmond (terms) and 242 Exhibition St, Melbourne (contact). Phone numbers differ across scholarship pages: 9107 4333, 9429 7444, 0499 005 284, 0460 005 126 and 1800 801 633.
- Target450: Patricia's "50% of homeless people are kids" contradicts the facts page (23%).
- "Prezzee" (drop-off page) and "Smart Prezzee" (hub). Altona North drop-off hours have no days.
- "Stolz" and "Stoltz". VACCA is named two ways. Carers page reuses the young people page's SEO title and description.

**Broken or missing**
- Bequests: "Gifts in Wills guide" button links back to the same page, and "refer to this card for suggested wording" points to a card that isn't there (the Promise For Kids booklet PDF may be it).
- Charitable status page: five documents with no links. Media centre mentions press kits but has none, and no media contact.
- Moorumbina virtual tour has no link. Preston uses a Moorumbina partners photo, and some Moorumbina gallery photos are named "Bairnsdale launch".
- Silent auction payment goes to the general donation form, which says gifts are tax deductible; the page says the payment isn't. Its SEO title reads "Give an Lifelong Gift".
- Return to Give asks people to "update payment details" but has no form for it. CONFIRM where it should go.
- Jade's letter only exists as small 215x300 thumbnails.

### Found while turning PDFs into pages (October 2026)
- Donate Your Car totals: the 2024 Impact Statement says "$20.3 million" since 2006 and "31,295" vehicles sold; the car pages say "over $23 million". Studios: "675" (2024 statement), "over 650" (About), 1000th studio (2019).
- 2025 Impact Statement: DFFH scholarships are "305" in the CEO message and "355" in the body. Village 21 Bairnsdale and Shepparton openings are "January and June 2026" in one place and "February and July 2026" in another (left out of the page).
- South Australia: "40" studios with "only two builds remaining" (2025 statement) against "51 studios in South Australia over three years" elsewhere.
- Reconciliation Action Plan: "22% of our clients (current at January 2024)" against 24% (January 2025) in the RAP media release. VACCA is "Victorian Aboriginal Child Care Agency" in the RAP and "Victorian Aboriginal Child and Community Agency" elsewhere.
- Strategic Plan says "Ken Morgan AO"; Our story says OAM.
- Bequests page: "refer to this card for suggested wording" points to a card that isn't on the page or in the Promise For Kids booklet. Suggested Will wording should be added.
