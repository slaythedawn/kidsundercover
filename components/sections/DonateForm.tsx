"use client";

import { useEffect, useState } from "react";
import type { DonateSection } from "@/lib/sections";
import s from "./DonateForm.module.css";

type Props = Pick<DonateSection, "start" | "once" | "monthly" | "note"> & {
  donateUrl: string;
  monthlyUrl: string;
  amountParam: string;
  titleHtml?: string;
  introHtml?: string;
};

/**
 * S22 Donation form. People choose one-off or monthly and an amount, see what
 * it does, then continue to the secure payment page (Giveasy for one-off gifts,
 * the regular giving form for monthly). Payment details are never taken here.
 */
export default function DonateForm({ start = "once", once, monthly, note, donateUrl, monthlyUrl, amountParam, titleHtml, introHtml }: Props) {
  const [freq, setFreq] = useState<"once" | "monthly">(start);
  const tiers = freq === "once" ? once : monthly;
  const [pick, setPick] = useState<number | "other">(tiers[1]?.amount ?? tiers[0]?.amount);
  const [other, setOther] = useState("");
  // Campaign tags (utm_*) from the page address, carried on to the payment page so gifts keep their source.
  const [utm, setUtm] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const keep = new URLSearchParams();
    q.forEach((v, k) => k.startsWith("utm_") && keep.set(k, v));
    setUtm(keep.toString());
  }, []);

  const amount = pick === "other" ? Number(other) || 0 : pick;
  const tier = tiers.find((t) => t.amount === pick);
  const base = freq === "once" ? donateUrl : monthlyUrl;
  const params = [amountParam && amount ? `${amountParam}=${amount}` : "", utm].filter(Boolean).join("&");
  const href = params ? `${base}${base.includes("?") ? "&" : "?"}${params}` : base;

  // Tells Google Tag Manager someone is heading to payment, with the gift they chose.
  const track = () => {
    const w = window as unknown as { dataLayer?: object[] };
    (w.dataLayer ??= []).push({ event: "begin_checkout", donation_frequency: freq, value: amount, currency: "AUD" });
  };

  const choose = (f: "once" | "monthly") => {
    setFreq(f);
    const t = f === "once" ? once : monthly;
    setPick(t[1]?.amount ?? t[0]?.amount);
  };

  return (
    <div className={`sheet sheet-stack ${s.form}`}>
      {titleHtml && <h2 className={s.title} dangerouslySetInnerHTML={{ __html: titleHtml }} />}
      {introHtml && <p className={s.intro} dangerouslySetInnerHTML={{ __html: introHtml }} />}

      <div className={s.freq} role="radiogroup" aria-label="How often">
        <button type="button" role="radio" aria-checked={freq === "once"} onClick={() => choose("once")}>Give once</button>
        <button type="button" role="radio" aria-checked={freq === "monthly"} onClick={() => choose("monthly")}>Give monthly</button>
      </div>

      <div className={s.amounts} role="radiogroup" aria-label="Amount">
        {tiers.map((t) => (
          <button key={t.amount} type="button" role="radio" aria-checked={pick === t.amount} onClick={() => setPick(t.amount)}>
            ${t.amount}
            {freq === "monthly" && <small>/month</small>}
          </button>
        ))}
        <button type="button" role="radio" aria-checked={pick === "other"} onClick={() => setPick("other")}>Other</button>
      </div>

      {pick === "other" ? (
        <label className={s.other}>
          <span>Your amount</span>
          <span className={s.otherField}>
            <b>$</b>
            <input inputMode="decimal" value={other} onChange={(e) => setOther(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Enter an amount" autoFocus />
          </span>
        </label>
      ) : (
        tier && (
          <p className={s.impact} aria-live="polite">
            <b>${tier.amount}{freq === "monthly" ? " a month" : ""}</b> {tier.text}
          </p>
        )
      )}

      <a className={`btn btn-ink ${s.go}`} href={href} onClick={track}>
        {freq === "once" ? "Continue to secure payment" : "Continue to set up monthly giving"}
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
      <p className={s.note}>
        {note ?? "Every donation over $2 is tax deductible. We'll email your tax receipt."}
      </p>
      <p className={s.secure}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
        Secure payment by card, Apple Pay, Google Pay or PayPal
      </p>
    </div>
  );
}
