"use client";

import { useEffect, useRef, useState } from "react";
import type { FormDef } from "@/content/forms";
import s from "./NativeForm.module.css";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * The website's own forms (content/forms.ts), posting to /api/forms/<id>.
 * Without JavaScript it's a plain form post; with it, errors show beside each question.
 */
export default function NativeForm({ def }: { def: FormDef }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState("");
  const [utm, setUtm] = useState<[string, string][]>([]);
  const turnstile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(location.pathname);
    setUtm([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("utm_")));
    if (SITE_KEY && !document.querySelector("script[data-turnstile]")) {
      const el = document.createElement("script");
      el.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      el.async = true;
      el.dataset.turnstile = "1";
      document.head.appendChild(el);
    }
  }, []);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const body: Record<string, string | string[]> = {};
    fd.forEach((v, k) => {
      const prev = body[k];
      body[k] = prev === undefined ? String(v) : [prev].flat().concat(String(v));
    });
    const r = await fetch(`/api/forms/${def.id}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const j = (await r?.json().catch(() => null)) as { ok?: boolean; redirect?: string; errors?: Record<string, string>; message?: string } | null;
    if (j?.ok && j.redirect) {
      location.href = j.redirect;
      return;
    }
    setErrors(j?.errors ?? {});
    setMessage(j?.message ?? "Sorry, something went wrong. Please try again.");
    setBusy(false);
    const first = j?.errors && Object.keys(j.errors)[0];
    if (first) document.getElementById(`${def.id}-${first}`)?.focus();
  }

  return (
    <form className={`sheet sheet-stack ${s.form}`} action={`/api/forms/${def.id}/`} method="post" onSubmit={send} noValidate>
      <div>
        <h2 className={s.title}>{def.title}</h2>
        {def.intro && <p className={s.intro}>{def.intro}</p>}
      </div>

      <div className={s.grid}>
        {def.fields.map((f) => {
          const id = `${def.id}-${f.name}`;
          const err = errors[f.name];
          const describedBy = [f.help && `${id}-help`, err && `${id}-err`].filter(Boolean).join(" ") || undefined;
          const common = { id, name: f.name, required: f.required, "aria-invalid": !!err || undefined, "aria-describedby": describedBy };
          if (f.type === "checkboxes") {
            return (
              <fieldset key={f.name} className={s.field} aria-describedby={describedBy}>
                <legend className={s.label}>{f.label}</legend>
                {f.help && <p id={`${id}-help`} className={s.help}>{f.help}</p>}
                {f.options?.map((o) => (
                  <label key={o} className={s.check}>
                    <input type="checkbox" name={f.name} value={o} /> <span>{o}</span>
                  </label>
                ))}
                {err && <p id={`${id}-err`} className={s.error}>{err}</p>}
              </fieldset>
            );
          }
          return (
            <div key={f.name} className={s.field} data-half={f.half || undefined}>
              <label htmlFor={id} className={s.label}>
                {f.label}
                {f.required && <span className={s.req} aria-hidden="true"> *</span>}
              </label>
              {f.help && <p id={`${id}-help`} className={s.help}>{f.help}</p>}
              {f.type === "textarea" ? (
                <textarea {...common} rows={5} className={s.input} />
              ) : f.type === "select" ? (
                <select {...common} className={s.input} defaultValue="">
                  <option value="" disabled>Choose one</option>
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input {...common} type={f.type} autoComplete={f.autocomplete} className={s.input} />
              )}
              {err && <p id={`${id}-err`} className={s.error}>{err}</p>}
            </div>
          );
        })}
      </div>

      {/* Left empty by people; bots fill it in. */}
      <div className={s.trap} aria-hidden="true">
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="page" value={page} />
      {utm.map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {SITE_KEY && <div ref={turnstile} className="cf-turnstile" data-sitekey={SITE_KEY} data-size="flexible" />}

      {def.consent && <p className={s.consent}>{def.consent}</p>}
      {message && <p className={s.message} role="alert">{message}</p>}
      <button type="submit" className="btn btn-ink" disabled={busy}>{busy ? "Sending..." : def.submit}</button>
    </form>
  );
}
