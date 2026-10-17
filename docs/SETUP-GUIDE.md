# Set-up guide: WordPress access and switching on the forms

Two jobs, about 30 minutes in total. Neither changes anything on the live kuc.org.au site.

---

## Part 1: Give the migration audit your WordPress login (10 minutes)

The audit runs on GitHub, so your password never goes into chat or into the code. It reads WordPress and writes what it finds to `media/wp-audit/`.

### 1. Create an Application Password in WordPress

1. Log in at https://www.kuc.org.au/wp-login.php
2. In the left menu go to **Users > Profile**. If you don't see Users, use the **Profile** item at the bottom of the menu.
3. Scroll to **Application Passwords**.
4. Under **New Application Password Name** type `KUC migration`, then click **Add New Application Password**.
5. Copy the password it shows. It looks like `abcd EFGH 1234 ijkl MNOP 5678`. It's only shown once. You can leave the spaces in.

**If there's no Application Passwords section:** Wordfence has switched it off. Ask KUC to untick "Disable WordPress application passwords" under Wordfence > Login Security > Settings, or to do step 2 below with an Admin login.

You can revoke this password at any time from the same screen. It can't be used to log in to the WordPress dashboard.

### 2. Add it to GitHub as two secrets

1. Open https://github.com/slaythedawn/kidsundercover
2. Go to **Settings > Secrets and variables > Actions**.
3. Click **New repository secret**:
   - Name `WP_USER`. Value: your WordPress username (the one you log in with, not your email address).
   - Click **Add secret**.
4. Click **New repository secret** again:
   - Name `WP_APP_PASSWORD`. Value: the password from step 1.
   - Click **Add secret**.

### 3. Run the audit

1. In the repo, open the **Actions** tab.
2. In the list on the left, click **Audit WordPress**.
3. Click **Run workflow** (on the right), choose the branch `claude/busy-archimedes-qd1ohw`, then click the green **Run workflow** button.
4. It takes about 3 minutes. A green tick means it finished and saved its results.
5. Tell Claude "the logged in audit has run". Claude reads `media/wp-audit/logged-in.json` and picks up the drafts, private pages and anything else your account can see.

### 4. What only KUC can give (Admin access)

Your Editor login can't see plugins, settings or form settings. Ask KUC for **one** of these:

- **Easiest:** an Application Password made from an Admin account, added to the same two GitHub secrets (or sent to you to add). Re-run the audit.
- **Or these three exports:**
  1. **Redirects:** Tools > Redirection > Import/Export > Export "Everything" as CSV.
  2. **Forms:** Forms > Import/Export > Export Forms, tick all forms, Download Export File. This shows where each form emails today.
  3. **Plugins:** a screenshot of the Plugins page. This shows which plugins are paid editions, so we know which subscriptions to cancel.

Drop the files in the chat and Claude takes it from there.

---

## Part 2: Switch on the forms in Vercel (15 minutes)

The contact, newsletter and Target450 forms save every submission to a database. KUC's new CRM will become their home once its details are known; until then the database holds them, and staff download them as a spreadsheet. No email service is needed.

### 1. Add the database

1. Go to https://vercel.com and open the project **kuc-homepage-prototype**.
2. Click the **Storage** tab, then **Create Database**.
3. Choose **Neon** (Serverless Postgres), then **Continue**.
4. Accept the terms if asked. Choose:
   - **Region:** Sydney (`aws-ap-southeast-2`). This keeps people's details in Australia, and it can't be changed later.
   - **Plan:** Free.
   - **Database name:** `kuc-website`
5. Click **Create**, then **Connect Project**. Choose `kuc-homepage-prototype`, tick all environments (Development, Preview and Production) and click **Connect**.

This adds `DATABASE_URL` and a few related settings to the project automatically. The table the forms use is created by itself on the first submission.

### 2. Add the download password

1. In the project go to **Settings > Environment Variables**.
2. Add:
   - **Key:** `FORMS_ADMIN_TOKEN`
   - **Value:** a long random password. A password manager can generate one; use letters and numbers only, at least 32 characters.
   - **Environments:** all three.
3. Click **Save**. Keep the value somewhere safe. Anyone who downloads submissions needs it.

### 3. Redeploy

New settings only apply to new deployments.

1. Go to the **Deployments** tab.
2. On the top deployment click **...** > **Redeploy**, then **Redeploy** again.
3. Wait for it to show **Ready** (about 2 minutes).

### 4. Test each form

1. Open the deployment, then go to `/about/contact/`.
2. Fill in the form with your own details, choose any topic and send it. You should land on the "Thank you for contacting us" page.
3. Do the same on `/sign-up-for-our-newsletter/` and `/target450/`.
4. Download what was saved. Open this address, replacing the two parts in capitals:

   `https://YOUR-DEPLOYMENT-ADDRESS/api/forms/export/?token=YOUR-FORMS-ADMIN-TOKEN`

   A spreadsheet downloads with your three test submissions. Add `&form=contact`, `&form=newsletter` or `&form=target450` for one form only.

**If a form says "This form isn't connected yet":** the database isn't reaching the deployment. Check `DATABASE_URL` is listed under Settings > Environment Variables for that environment, then redeploy.

### 5. Optional, before launch: spam protection

The forms already block simple bots with a hidden field. If spam gets through after launch, add Cloudflare Turnstile (free):

1. In Cloudflare go to **Turnstile > Add widget**. Name it `KUC website`, add the hostnames `kuc.org.au` and `www.kuc.org.au`, and choose **Managed**.
2. Copy the **Site Key** and **Secret Key** into Vercel environment variables as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, then redeploy.

---

## When KUC's CRM is chosen

Send Claude the CRM's name and an API key, or the person who can create one. Each new submission then also goes into the CRM, and the existing ones can be loaded in from the database. The `salesforce_id` column in the database will be renamed for the CRM's record ID. Any notification emails to staff can be set up in the CRM itself, so the website doesn't need its own email service.
