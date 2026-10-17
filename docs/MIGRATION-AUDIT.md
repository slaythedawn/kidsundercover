# WordPress migration audit

Everything the current kuc.org.au WordPress site holds or does, checked against the new site, so nothing is left behind when WordPress is switched off. Audited 17 October 2026.

**How it was checked**

- `scripts/audit-wordpress.mjs`, run by the "Audit WordPress" GitHub Action, reads the WordPress REST API, the Yoast sitemaps and every published page. It records forms, embeds, scripts, tracking tags, files and redirects in `media/wp-audit/`. Re-run it from the Actions tab at any time.
- GA4 (property 328714114, viewer access) gave two years of real page views across every KUC domain. The 315 kuc.org.au addresses with 5 or more views are in `docs/audit/ga-paths.tsv`.
- Both lists were tested against a production build of the new site.

## Result

| Check | Result |
|---|---|
| Published WordPress pages, posts, media releases and team profiles (194 addresses) | All 194 work on the new site |
| Addresses people visited in the last two years (315) | 305 work. The other 10: five linked documents (see Documents), four dead addresses that are also dead on the live site, and `/404.html` |
| Redirects set up in the live site's Redirection plugin | All carried over, pointing at the new pages |
| Donation and form integrations | All mapped below; Salesforce donation forms now embedded |

Only the public view was audited. With a WordPress Application Password (see "From KUC" below) the Action also picks up drafts, private and scheduled pages.

## What WordPress runs

**Content:** 78 pages, 73 posts, 28 media releases and 13 team profiles (custom post types), plus two team categories. No comments are shown. No reusable blocks are public.

**Theme:** a custom theme, `kidsundercover`. Several pages (thank you pages, car FAQs, towing contributions) are built from theme fields, not the page body, which is why the first migration missed them.

**Plugins** (from the REST API and page source), and what replaces each:

| Plugin | What it does now | On the new site |
|---|---|---|
| Yoast SEO | Titles, descriptions, sitemaps, robots.txt, schema | `scripts/seo-titles.mjs`, `app/sitemap.ts`, `app/robots.ts`, `lib/schema.tsx` |
| Redirection | About 40 redirects | `next.config.ts` |
| Gravity Forms (paid licence) | Contact, newsletter and Target450 forms | **Built.** The site's own forms, saving to the website database (`docs/FORMS.md`). Licence not needed |
| WP Mail SMTP | Sends form notification emails | Not needed; KUC's CRM will notify staff. Optional Resend support is built in |
| MonsterInsights | A second GA4 install, the cause of double counting | Dropped; GA4 runs through GTM only |
| Google Site Kit | Connects Search Console and Analytics inside WordPress | Dropped; Search Console verified by DNS (see Search Console) |
| LiteSpeed Cache | Page caching | Vercel's CDN |
| Wordfence | Security and login protection | Not needed; there's no login on the new site |
| Duplicate Post, Easy Fancybox, Responsive Video Embeds | Editing helpers, lightbox, video sizing | Built into the new site's sections |
| adsagent | Unknown; exposes a REST namespace | CONFIRM with KUC what it is |

## Donations and forms: every integration

| What | Where it lives | Live site | New site |
|---|---|---|---|
| One-off donations | Giveasy, at donatenow.kuc.org.au | `/get-involved/donate/` redirects straight to the current Giveasy appeal (Futures for Kids, `utm_campaign=eocy25`). Appeals in GA4: Giving Day 2026, Christmas (Brent's story), Aminah's story, Futures for Kids, Big Build 4 Kids 2025 | Our donation page hands one-off gifts to Giveasy with campaign tags. Giveasy returns donors to `/get-involved/donate/thank-you/`, which now exists and fires `donation_complete` |
| Monthly giving | Salesforce NPSP Plus form `a3kMo000001bAMPIA2`, embedded with KUC's drop-in script from connect.kuc.org.au | On `/regular-donation/` | **Fixed.** Embedded on `/regular-donation/` (section S23). Every "Give monthly" button lands on it, passing campaign tags |
| Return to Give (failed regular gifts) | NPSP form `a3kMo000001bAJBIA2` | On `/return-to-give/` | **Fixed.** Embedded. This also clears the earlier flag that the page had no form |
| Partner donations | NPSP form `a3kMo0000062flBIAQ` | On `/partner-donations/` | **Fixed.** Was wrongly going to Giveasy in the rebuild; now the Salesforce form |
| Silent auction payments | NPSP form `a3kMo000004RU69IAG` | On `/silent_auction/` | **Fixed.** Was wrongly going to the general donation form |
| Car towing contributions | NPSP form `a3kMo000000LvHpIAK` | On `/donate-your-car-towing-contributions/` | **Added.** The page was missing from the rebuild |
| Donate Your Car form | Salesforce site, AngularJS 1.6.5. The same app answers at kuc.my.salesforce-sites.com/Donateyourcar and connect.kuc.org.au/donateyourcar | Linked from every car page, with stale `_ga` and `_gl` values in the link | Linked clean. Returns to `/get-involved/donate-your-car/thank-you/`, which on the live site redirected to the general contact thank you page. It now has its own page firing `car_donation_complete` |
| Studio applications | Microsoft Forms: "Apply for a Kids Under Cover Studio" (for social workers) and the Studio Expression of Interest form | The site's two most clicked outbound links (about 1,100 and 780 clicks a year) | **Fixed.** The main application form was missing from the rebuild; it's now the first button on the applications page, with the referral and assessment steps |
| DFFH scholarship portal | Salesforce Experience Cloud, kuc.my.site.com/portal | Linked from the DFFH scholarship page (about 260 clicks a year) | Linked |
| Contact form | Gravity Forms form 2: name, email (twice), "I want help with...", comments | `/about/contact/` | **Built.** Same questions, routed to an inbox by topic, saved to the database, thank you page fires `contact_complete` |
| Newsletter | Gravity Forms form 3: name, email, consent wording | `/sign-up-for-our-newsletter/` | **Built.** Consent wording saved with each signup. CONFIRM the newsletter platform so signups flow straight in |
| Target450 messages of support | Gravity Forms form 8: name, email, message, four interest boxes | `/target450/` | **Built.** New thank you page fires `target450_complete` |
| Raisely | Script on every page; a Raisely donation embed (campaign `kidsundercoverwebsite`) on one 2023 story and the template page | Not used for current giving | Not carried over. CONFIRM KUC no longer uses Raisely |
| AutoGrab car offer | An AutoGrab embed with an API key | Only on `/donate-your-car-test-page/` | Not carried over. CONFIRM whether this was a trial worth reviving for "sell or donate" |
| Virtual tours | virtual.macuport.com | Village 21 Preston, Bairnsdale, Moorumbina Mongurnallin | **Fixed.** All three tours linked from each program page and Village 21 |
| Videos | YouTube and one Vimeo video (Village 21 Preston) | Program pages | **Fixed.** Video section now plays Vimeo; Preston and Moorumbina videos added |
| Drop off map | Google My Maps | Embedded on the drop off locations page | Linked from that page |
| Gifts in Wills | Gathered Here free Will platform | Bequest pages | Linked |

## Subscriptions: what to keep and what to cancel

Nothing is carried over unless the new site needs it. CONFIRM with KUC which of these they pay for today; editions marked "unknown" can be read off the plugin list once there's Admin access.

| Service | Today | On the new site | Action |
|---|---|---|---|
| WordPress hosting and support (Itomic) | Paid | Not needed | Cancel after the cutover month |
| Gravity Forms | Paid licence | Replaced by the site's own forms | Cancel at renewal |
| Yoast SEO | Free or Premium (unknown) | Replaced (`scripts/seo-titles.mjs`, sitemap, schema) | Cancel Premium if paid |
| MonsterInsights | Lite (free) edition | Removed; it causes the double counting | Nothing to cancel |
| WP Mail SMTP and its mail provider | Free or Pro (unknown) | Not needed; notifications will come from KUC's CRM | Cancel if paid |
| Wordfence | Free or Premium (unknown) | Not needed; no login on the new site | Cancel Premium if paid |
| LiteSpeed Cache, Site Kit, Redirection, Duplicate Post, Easy Fancybox, Responsive Video Embeds | Free | Not needed | None |
| Raisely | Script still on every page | Not used | CONFIRM, and cancel if KUC still pays |
| Hotjar | Running on every page | Not added | CONFIRM, and cancel if paid and nobody uses it |
| AutoGrab | On a test page only | Not used | CONFIRM, and cancel if paid |
| Giveasy, Salesforce (NPSP Plus forms, car form, portal), Microsoft Forms, Google Workspace or Microsoft 365 email | Paid or included | Still used | Keep |

New services, all on free plans:

| Service | What for | Cost |
|---|---|---|
| Neon Postgres (through Vercel), Sydney | Form submissions database | Free plan |
| Cloudflare Turnstile | Spam protection on forms | Free |
| Vercel | Hosting | Vercel's free Hobby plan is for personal, non-commercial sites, so a charity's live site should run on Pro (US$20 per member a month). This replaces the WordPress hosting cost |
| Vercel Blob | Documents at their old `/wp-content/uploads/` addresses | Included allowance covers about 300 MB of documents; check on Pro |

## Logging in to WordPress

The audit runs logged out, so it sees only the public site. Logging in adds:

| Access | What it adds |
|---|---|
| Editor (Josh's current level) | Drafts, private and scheduled pages, reusable blocks |
| Admin | Plugin list with editions (to confirm the subscriptions above), site settings, menus, the Redirection plugin's full rule list, and Gravity Forms settings, including where each form emails today |

Step by step: `docs/SETUP-GUIDE.md` (Part 1). How to connect, safest first:

1. **Application Password and the audit Action.** In WordPress go to Users > Profile > Application Passwords and create one named "KUC migration". In GitHub go to Settings > Secrets and variables > Actions and add `WP_USER` and `WP_APP_PASSWORD`. Then re-run "Audit WordPress". The audit picks up everything above that the account allows (`media/wp-audit/logged-in.json`), and the password never appears in chat or code.
2. **Direct from these sessions.** The cloud environment blocks kuc.org.au. Adding `www.kuc.org.au` under Allowed domains in the environment's network settings, plus the two values above as environment secrets, lets Claude query WordPress directly.
3. **Not suitable:** the WordPress.com connector only works for sites hosted on WordPress.com. kuc.org.au is self-hosted.

## Tracking found

| Tag | Where | Notes |
|---|---|---|
| GTM-NJ6L8XG | Every page, Giveasy pages and the Salesforce car form | The main container. Keep |
| GA4 G-JFF1V7SQJJ | Sent by both GTM and MonsterInsights | Double counting. Remove MonsterInsights |
| GA4 G-GVKD1BWKW6 | The Salesforce car form | A separate stream, so the form's visits don't join up with the website's. Move into the main property with cross domain measurement |
| UA-18089342-1 | The Salesforce car form | Universal Analytics, dead since 2024. Remove |
| Meta pixels 1831766414291468 and 720310691496734 | Every page | Two pixels; CONFIRM both are in use |
| Meta pixel 299709124079278 | The Salesforce car form | A third pixel. CONFIRM |
| Hotjar 1853845 | Every page | CONFIRM it's still used |
| Floodlight 5435816 (DoubleClick) | The Salesforce car form | An old Campaign Manager conversion tag. CONFIRM |
| GTM-KPMZ4JM, G-7PC84FGF0J, UA-91053368-30 | One media release | Belong to the Canberra Times article embedded on that page, not KUC |

The thank you pages on the new site now push named events (`car_donation_complete`, `donation_complete`, `contact_complete`, `newsletter_complete`) with the visit's campaign tags. GTM conversions should use these events, not page addresses. On the live site car donations land on the contact thank you page, so the "contact" conversion has been counting car donations too.

## Documents

79 documents in the media library (52 PDFs, 21 Word files, a spreadsheet, zips and a calendar file), about 300 MB. 50 are linked from live pages, and GA4 shows people open them from emails and other sites at their `/wp-content/uploads/...` addresses. Images are linked the same way.

**Recommendation:** copy every file in the media library to Vercel Blob storage and add one rewrite so `/wp-content/uploads/*` keeps working at the same address. That keeps every old link alive and stays out of the code repository. It needs a Blob store on the Vercel project (decision for Josh, small monthly cost). The site's own photos are already processed into `public/media`.

## Search Console

Your Google account (joshuapcck@gmail.com) sees `https://www.kuc.org.au/` in Search Console as unverified, so there is no data yet. Site Kit is installed, so whoever connected it owns the property.

Two things are needed:

1. **Now:** KUC's Search Console owner adds joshuapcck@gmail.com as a Full user. That gives real search data before launch, to check titles and catch any address the redirects miss.
2. **Before launch:** set up a Domain property (`kuc.org.au`) verified with a DNS TXT record. Site Kit and Yoast verification disappear when WordPress is switched off, and a DNS verified property keeps working through the move. Submit the new sitemap on launch day.

Request to send to KUC (ready to paste):

> Hi Bianca, could your Search Console owner add joshuapcck@gmail.com as a Full user on the kuc.org.au property? In Search Console: Settings, Users and permissions, Add user. Before launch we'll also need a DNS TXT record added for kuc.org.au so the property stays verified when the site moves. We'll send the exact record when it's time.

## From KUC

1. Search Console access (above).
2. A WordPress Application Password, or a CSV export of the Redirection plugin's rules, plus an export of Gravity Forms entries settings (where each form's submissions go: email addresses, any Salesforce feed).
3. GTM publish access, to set up the conversions above and remove the old tags.
4. Salesforce: add the new site's preview domain to the allowed framing domains for the NPSP Plus forms (Salesforce Sites clickjack settings), so the embedded forms can be tested before launch. On launch the domain is the same, so nothing changes.
5. Confirm: Raisely, AutoGrab, Hotjar, the extra Meta pixels and the Floodlight tag; what `adsagent` is; whether `/MelbourneCentralTower` (43 visits, a dead address) was printed on something.

## Cutover checklist

- [ ] Documents and images copied to Blob storage, `/wp-content/uploads/*` rewrite live
- [x] Native contact, newsletter and Target450 forms built, with thank you pages
- [ ] Database connected and a test sent through each form (`docs/SETUP-GUIDE.md`)
- [ ] Forms connected to KUC's new CRM once chosen
- [ ] Salesforce framing allows the new domain; each NPSP form tested with a real payment
- [ ] Giveasy and the Salesforce car form return URLs tested on the new domain
- [ ] GTM: MonsterInsights gone, conversions on the new events, cross domain measurement for Giveasy and Salesforce
- [ ] Search Console Domain property verified by DNS; sitemap submitted on launch day
- [ ] DNS for kuc.org.au and www pointed at Vercel; connect, donatenow and the Salesforce domains left as they are
- [ ] Run `docs/audit/ga-paths.tsv` against the live new site; every address 200 or redirected
- [ ] WordPress kept read only for a month, then retired
