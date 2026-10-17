# Forms and the website database

The contact, newsletter and Target450 forms are now the website's own. They replace the Gravity Forms plugin, WP Mail SMTP and the form plugins' entries table on WordPress. KUC is bringing in its own CRM; once its details are known, submissions also go there. Questions and options are the live forms' own (`content/forms.ts`).

## How a submission flows

1. **Spam check.** A hidden field that bots fill in, plus Cloudflare Turnstile (free) once its keys are set.
2. **Saved** to the website database: one row per submission in the `submissions` table (`db/schema.sql`), with the page it came from and its campaign tags.
3. **Optional email.** Only if `RESEND_API_KEY` is set: an email to the right KUC inbox, routed by the contact form's "I want help with..." answer. Not planned for now; staff notifications will come from KUC's CRM.
4. **Thank you page.** The page fires a conversion event for Google Tag Manager (`contact_complete`, `newsletter_complete`, `target450_complete`).

If the database isn't connected yet, the form says so and gives the email address, so nothing is silently lost. It works without JavaScript too.

**Staff access:** download any form's submissions as a spreadsheet at `/api/forms/export/?form=contact&token=...` (forms: `contact`, `newsletter`, `target450`, or leave `form` off for all). Claude can also read and summarise them on request.

## Which database, and why

Chosen: **Neon Postgres in Sydney, added through the Vercel project's Marketplace, on the free plan.**

| Option | Cost for KUC's volume | Data held in | Downsides | Verdict |
|---|---|---|---|---|
| **Neon** (Postgres, via Vercel Marketplace) | Free: 0.5 GB, 100 compute hours a month. A contact form uses a tiny fraction | Sydney (choose `ap-southeast-2` when creating it) | No spreadsheet-style screen for staff; they download a spreadsheet instead | **Chosen.** No subscription, Australian data, sleeps when idle and wakes in about a second, billed and owned through KUC's Vercel account |
| Supabase | Free plan pauses a project after a week without activity, so a quiet contact form would go offline. Pro is US$25 a month | Sydney available | The pause on Free, or a new subscription | Not chosen |
| Airtable | Team plan about US$20 per user a month (50% nonprofit discount). Free plan caps records | US by default; Australian storage only on Enterprise Scale | Personal details held in the US, per-seat cost, API rate limits | Not chosen for personal details. Fine for content planning |
| Salesforce | KUC already pays for it | Salesforce | We don't have access yet; ownership not confirmed | **The long-term home.** Once KUC gives API access, each submission also goes to Salesforce (the `salesforce_id` column is ready) and the website database stays as a backup log |

## Set-up

Step by step: `docs/SETUP-GUIDE.md` (Part 2). In short: add Neon (Sydney, free) from the Vercel project's Storage tab, add `FORMS_ADMIN_TOKEN`, redeploy, test each form. `.env.example` lists every variable.

## CONFIRM with KUC

- **CRM.** Name and API access for KUC's new CRM, so submissions flow into it.
- **Inboxes.** Only needed if the website sends its own emails: which inbox each contact topic goes to (`content/forms.ts`).
- **Newsletter.** Which platform KUC sends the newsletter from, so signups can flow straight into it. Until then they're in the database and the export.
- **Privacy policy.** It should say form details are stored in Australia, and name the CRM once chosen.

## Free plan limits to watch

- **Neon:** 0.5 GB holds hundreds of thousands of submissions.
- **Resend** (only if email is switched on): 100 emails a day on the free plan.
