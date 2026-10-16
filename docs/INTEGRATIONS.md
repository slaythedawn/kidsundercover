# Donations, forms and integrations

Where every giving journey and form lives today (full audit of the live site in `docs/MIGRATION-AUDIT.md`), how the new site connects to it, and the plan to bring it in house. Links the site uses are set in `content/site.ts` (`external`).

## Today

| Journey | Lives on | How it works now | In the new site |
|---|---|---|---|
| One-off donation | Giveasy, `donatenow.kuc.org.au/general/donate` | Giveasy hosted page. $25, $75, $100 or custom, optional fee cover, card, Apple Pay, Google Pay, PayPal. Emails the tax receipt. | Donation form (S22) on `/get-involved/donate/` lets people choose an amount and see what it does, then hands over to Giveasy. |
| Monthly donation | Salesforce NPSP Plus form `a3kMo000001bAMPIA2`, embedded with KUC's drop-in script from connect.kuc.org.au | Form in an iframe on the WordPress page, paid through Stripe. | Embedded on `/regular-donation/` (S23). Every "Give monthly" button lands there with campaign tags. |
| Car donation | Salesforce site, `kuc.my.salesforce-sites.com/Donateyourcar` | Multi-step form on AngularJS 1.6 (unsupported since 2022). No event tracking. Cross-domain tracking broken, so campaign source is lost and gifts show as direct. | All four Donate Your Car pages link to it. |
| Studio Program application and expression of interest | Microsoft Forms: the application form for social workers, and `forms.office.com/r/Q7v75x5kyT` | Completed by a support worker. | Both linked from the applications page; the expression of interest form also from Studio Program. |
| Newsletter, contact, scholarship applications, fundraising registration | WordPress forms on the current site | Plugin forms on each page. | Placeholder cards (`components/page/FormBlock.tsx`) that link to the live forms. |
| Partner donations, Return to Give, silent auction, car towing contributions | Salesforce NPSP Plus forms, one per page (IDs in `docs/MIGRATION-AUDIT.md`) | Campaign specific forms in iframes. | Each page embeds its own form (S23). |
| Peaks of Hope | Inspired Adventures | External event page. | Linked. |

## Already done in the new site

- One place to change every destination: `content/site.ts`.
- The donation form passes campaign tags (`utm_source`, `utm_medium`, `utm_campaign` and so on) from the page address on to the payment page, and sends a `begin_checkout` event (frequency, amount, AUD) to Google Tag Manager when someone continues to payment.
- No stale `_ga` or `_gl` parameters in any link (they were stripped during migration).

## To confirm with KUC

1. **Giveasy:** can the amount be pre-filled from a link (a query parameter)? If yes, set `donateAmountParam` in `content/site.ts` and the amount people pick on our form carries through. Can Giveasy take monthly gifts, so all giving is in one place? Is there an embeddable Giveasy form, so payment can happen on the Donate page itself?
2. **Monthly giving:** which system should own it after launch: the Salesforce NPSP widget, or Giveasy recurring.
3. **Salesforce car form:** who owns it (not yet confirmed), and whether KUC wants it rebuilt.
4. **Forms:** which plugin runs the newsletter, contact and scholarship forms, and where submissions go (email, Salesforce, both).

## Plan

**Phase 1, at launch (low risk).** Keep every payment on Giveasy and Salesforce. The new pages are the front door, with the amount and frequency chosen on our site. Fix tracking at the same time: one GA4 install through GTM only, the GA4 cross-domain linker for `donatenow.kuc.org.au` and `kuc.my.salesforce-sites.com`, and the `begin_checkout` event from our donation form.

**Phase 2, native forms.** Rebuild newsletter, contact, scholarship applications, fundraising registration and the studio expression of interest as forms on the site that post to Salesforce through a small server route (Salesforce API or Web-to-Lead), with spam protection and a thank you page that fires a conversion event. This removes the WordPress form plugins and Microsoft Forms.

**Phase 3, car donation form.** Replace the AngularJS Salesforce form with a short multi-step form on the site (vehicle, location, owner, contact, drop off or collection), posting to the same Salesforce objects. Every step fires an event, so drop off points are visible for the first time.

**Phase 4, payments on site (optional).** If Giveasy offers an embed or API, take payment on the Donate page itself. Otherwise stay with the hosted page, which is the safer option for card security (PCI).
