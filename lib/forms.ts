import { neon } from "@neondatabase/serverless";
import { forms, type FormDef, type FormId } from "@/content/forms";

/**
 * Form handling for the website's own forms (content/forms.ts). Each submission is:
 *   1. checked for spam (a hidden field, plus Cloudflare Turnstile when its keys are set),
 *   2. saved to the website database (Neon Postgres, Sydney) when DATABASE_URL is set,
 *   3. emailed to the right KUC inbox through Resend when RESEND_API_KEY is set.
 * If neither 2 nor 3 is set up, the form says so rather than losing the message.
 * Set-up and running costs: docs/FORMS.md.
 */

export type Submission = {
  form: FormId;
  data: Record<string, string | string[]>;
  page?: string;
  utm?: Record<string, string>;
};

export type Result = { ok: true } | { ok: false; status: number; errors?: Record<string, string>; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks answers against the form's questions. Returns an error per field, or nothing. */
export function validate(def: FormDef, data: Record<string, string | string[]>) {
  const errors: Record<string, string> = {};
  for (const f of def.fields) {
    const v = data[f.name];
    const text = Array.isArray(v) ? v.join("") : (v ?? "").trim();
    if (f.required && !text) {
      errors[f.name] =
        f.type === "select" ? "Please choose one of the options."
        : f.type === "email" ? "Please enter your email address."
        : `Please fill in ${f.label.toLowerCase()}.`;
    }
    else if (f.type === "email" && text && !EMAIL.test(text)) errors[f.name] = "Please check your email address.";
    else if (f.type === "select" && text && !f.options?.includes(text)) errors[f.name] = "Please choose one of the options.";
    else if (f.type === "checkboxes" && Array.isArray(v) && v.some((x) => !f.options?.includes(x))) errors[f.name] = "Please choose from the options.";
    else if (text.length > 5000) errors[f.name] = "That's a bit long. Please keep it under 5,000 characters.";
  }
  return Object.keys(errors).length ? errors : undefined;
}

/** Cloudflare Turnstile check. Skipped (passes) until TURNSTILE_SECRET_KEY is set. */
export async function humanCheck(token: string | undefined, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
  }).catch(() => null);
  const j = (await r?.json().catch(() => null)) as { success?: boolean } | null;
  return !!j?.success;
}

let ready: Promise<unknown> | undefined;
/** Creates the submissions table the first time it's needed (see db/schema.sql). */
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const sql = neon(url);
  ready ??= sql`
    create table if not exists submissions (
      id bigserial primary key,
      form text not null,
      created_at timestamptz not null default now(),
      email text,
      first_name text,
      last_name text,
      data jsonb not null,
      page text,
      utm jsonb,
      consent text,
      notified_to text,
      salesforce_id text
    )`.then(() => sql`create index if not exists submissions_form_created on submissions (form, created_at desc)`);
  return { sql, ready };
}

/** The inbox for this submission: by topic when the form routes, else the form's own. */
export function inboxFor(def: FormDef, data: Submission["data"]) {
  const pick = def.routeBy && data[def.routeBy.field];
  return (typeof pick === "string" && def.routeBy?.to[pick]) || def.notify;
}

async function email(def: FormDef, s: Submission, to: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const rows = def.fields.map((f) => {
    const v = s.data[f.name];
    return `${f.label}\n${Array.isArray(v) ? v.map((x) => `- ${x}`).join("\n") : v || "-"}`;
  });
  const extra = [s.page && `Sent from: ${s.page}`, s.utm && Object.keys(s.utm).length ? `Campaign: ${Object.entries(s.utm).map(([k, v]) => `${k}=${v}`).join(", ")}` : ""];
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FORMS_FROM ?? "Kids Under Cover website <onboarding@resend.dev>",
      to: process.env.FORMS_TO_OVERRIDE ?? to,
      reply_to: typeof s.data.email === "string" ? s.data.email : undefined,
      subject: `${def.title}: ${[s.data.firstName, s.data.lastName].filter(Boolean).join(" ")}${typeof s.data.topic === "string" ? ` (${s.data.topic})` : ""}`,
      text: [...rows, "", ...extra.filter(Boolean), "", "Saved in the website database. Reply to this email to answer them directly."].join("\n\n"),
    }),
  }).catch(() => null);
  return !!r?.ok;
}

/** Saves and sends one submission. */
export async function submit(s: Submission): Promise<Result> {
  const def = forms[s.form];
  const errors = validate(def, s.data);
  if (errors) return { ok: false, status: 422, errors, message: "Please check the highlighted answers." };

  const store = db();
  const to = inboxFor(def, s.data);
  if (!store && !process.env.RESEND_API_KEY) {
    return { ok: false, status: 503, message: `This form isn't connected yet. Please email ${to} instead.` };
  }

  let saved = false;
  if (store) {
    try {
      await store.ready;
      const str = (k: string) => (typeof s.data[k] === "string" ? (s.data[k] as string) : null);
      await store.sql`
        insert into submissions (form, email, first_name, last_name, data, page, utm, consent, notified_to)
        values (${s.form}, ${str("email")}, ${str("firstName")}, ${str("lastName")}, ${JSON.stringify(s.data)}, ${s.page ?? null},
                ${s.utm ? JSON.stringify(s.utm) : null}, ${def.consent ?? null}, ${to})`;
      saved = true;
    } catch (e) {
      console.error("forms: database insert failed", e);
    }
  }
  const sent = await email(def, s, to);
  if (!saved && !sent) return { ok: false, status: 502, message: `Sorry, something went wrong sending this. Please email ${to} instead.` };
  return { ok: true };
}

/** Submissions as CSV, for staff to download (app/api/forms/export). */
export async function exportCsv(form?: FormId) {
  const store = db();
  if (!store) return undefined;
  await store.ready;
  const rows = (form
    ? await store.sql`select * from submissions where form = ${form} order by created_at desc`
    : await store.sql`select * from submissions order by created_at desc`) as Record<string, unknown>[];
  const keys = [...new Set(rows.flatMap((r) => Object.keys((r.data as object) ?? {})))];
  const head = ["id", "form", "created_at", ...keys, "page", "utm", "notified_to", "salesforce_id"];
  const cell = (v: unknown) => {
    const t = v == null ? "" : Array.isArray(v) ? v.join("; ") : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const lines = rows.map((r) =>
    head.map((h) => cell(keys.includes(h) ? (r.data as Record<string, unknown>)[h] : r[h] instanceof Date ? (r[h] as Date).toISOString() : r[h])).join(","),
  );
  return [head.join(","), ...lines].join("\n");
}
