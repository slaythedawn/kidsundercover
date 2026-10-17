-- Website database (Neon Postgres, Sydney). lib/forms.ts creates this table on first use;
-- this file is the same definition, for reference or to run by hand.
create table if not exists submissions (
  id bigserial primary key,
  form text not null,                 -- contact, newsletter or target450 (content/forms.ts)
  created_at timestamptz not null default now(),
  email text,
  first_name text,
  last_name text,
  data jsonb not null,                -- every answer, as sent
  page text,                          -- the page the form was on
  utm jsonb,                          -- campaign tags from that page's address
  consent text,                       -- the consent wording shown, when the form has one
  notified_to text,                   -- the KUC inbox it was emailed to
  salesforce_id text                  -- filled in once submissions sync to Salesforce
);
create index if not exists submissions_form_created on submissions (form, created_at desc);
