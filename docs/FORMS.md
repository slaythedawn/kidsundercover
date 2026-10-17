# Forms and the website database

The contact, newsletter and Target450 forms are now the website's own. They replace the Gravity Forms plugin, WP Mail SMTP and the form plugins' entries table on WordPress. Questions and options are the live forms' own (`content/forms.ts`).

## How a submission flows

1. **Spam check.** A hidden field that bots fill in, plus Cloudflare Turnstile (free) once its keys are set.
2. **Saved** to the website database: one row per submission in the `submissions` table (`db/schema.sql`), with the page it came from and its campaign tags.
3. **Emailed** to the right KUC inbox through Resend, with the person's email as the reply address. The contact form routes by "I want help with..." (studio, scholarships, fundraising, general).
4. **Thank you page.** The page fires a conversion event for Google Tag Manager (`contact_complete`, `newsletter_complete`, `target450_complete`).

If the database and email aren't connected yet, the form says so and gives the email address, so nothing is silently lost. It works without JavaScript too.

**Staff access:** download any form's submissions as a spreadsheet at `/api/forms/export/?form=contact&token=...` (forms: `contact`, `newsletter`, `target450`, or leave `form` off for all). Claude can also read and summarise them on request.

## Which database, and why

Chosen: **Neon Postgres in Sydney, added through the Vercel project's Marketplace, on the free plan.**

| Option | Cost for KUC's volume | Data held in | Downsides | Verdict |
|---|---|---|---|---|
| **Neon** (Postgres, via Vercel Marketplace) | Free: 0.5 GB, 100 compute hours a month. A contact form uses a tiny fraction | Sydney (choose `ap-southeast-2` when creating it) | No spreadsheet-style screen for staff; they download a spreadsheet instead | **Chosen.** No subscription, Australian data, sleeps when idle and wakes in about a second, billed and owned through KUC's Vercel account |
| Supabase | Free plan pauses a project after a week without activity, so a quiet contact form would go offline. Pro is US$25 a month | Sydney available | The pause on Free, or a new subscription | Not chosen |
| Airtable | Team plan about US$20 per user a month (50% nonprofit discount). Free plan caps records | US by default; Australian storage only on Enterprise Scale | Personal details held in the US, per-seat cost, API rate limits | Not chosen for personal details. Fine for content planning |
| Salesforce | KUC already pays for it | Salesforce | We don't have access yet; ownership not confirmed | **The long-term home.** Once KUC gives API access, each submission also goes to Salesforce (the `salesforce_id` column is ready) and the website database stays as a backup log |

## Set-up (about 15 minutes, in KUC's or Josh's Vercel account)

1. **Database:** Vercel project `kuc-homepage-prototype` > Storage > Create Database > Neon. Choose the free plan and region **Sydney (ap-southeast-2)**, then connect it to the project. This adds `DATABASE_URL` automatically. The table is created on the first submission.
2. **Email:** create a free Resend account, add and verify the `kuc.org.au` domain (two DNS records KUC adds), and create an API key. In Vercel > Settings > Environment Variables add:
   - `RESEND_API_KEY`
   - `FORMS_FROM`, for example `Kids Under Cover website <website@kuc.org.au>`
   - Until the domain is verified, Resend only sends to the account owner, so for testing also set `FORMS_TO_OVERRIDE` to that address.
3. **Spam protection:** create a free Cloudflare Turnstile widget for the site's domains. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
4. **Staff downloads:** add `FORMS_ADMIN_TOKEN`, a long random string, and share it with whoever downloads submissions.
5. Redeploy, send a test through each form, and check the email arrives and the row appears in the export.

`.env.example` lists every variable.

## CONFIRM with KUC

- **Inboxes.** Which inbox each contact topic goes to (`content/forms.ts`). The addresses used are ones already published on the site.
- **Newsletter.** Which platform KUC sends the newsletter from, so signups can flow straight into it. Until then they're in the database and the export.
- **Privacy policy.** It should say form details are stored in Australia and emailed to staff, and name Resend as the email provider.

## Free plan limits to watch

- **Resend:** 100 emails a day and 3,000 a month on the free plan. That's one email per submission. If a campaign pushes newsletter signups past 100 a day, emails pause until the next day, but every submission is still saved in the database. Upgrading is US$20 a month.
- **Neon:** 0.5 GB holds hundreds of thousands of submissions.
