import type { FormKind } from "@/lib/content";
import { external, links } from "@/content/site";
import s from "./FormBlock.module.css";

/**
 * Cards for forms that live elsewhere (scholarships and studio applications on Microsoft Forms,
 * fundraising, donations). Contact, newsletter and Target450 are the site's own forms (NativeForm).
 */
const forms: Record<Exclude<FormKind, "target450">, { title: string; text: string; fields: string[]; action: { label: string; href: string } }> = {
  newsletter: {
    title: "Get our newsletter",
    text: "Stories, news and ways to help, a few times a year.",
    fields: ["First name", "Last name", "Email"],
    action: { label: "Sign up", href: links.newsletter },
  },
  contact: {
    title: "Send us a message",
    text: "Our team will get back to you.",
    fields: ["Name", "Email", "Phone", "Your message"],
    action: { label: "Send", href: links.contact },
  },
  scholarship: {
    title: "Apply for a scholarship",
    text: "Applications are made online. Check the eligibility details on this page first.",
    fields: ["Applicant name", "Email", "Phone", "What the scholarship is for"],
    action: { label: "Start application", href: links.applyScholarship },
  },
  studio: {
    title: "Apply for the Studio Program",
    text: "Applications are made by a referring agency on behalf of a young person and their family.",
    fields: ["Agency", "Your name", "Email", "Phone"],
    action: { label: "Start referral", href: "/our-programs/studio-program/kids-under-cover-studio-program-applications/" },
  },
  fundraising: {
    title: "Register your fundraiser",
    text: "Tell us what you're planning and we'll help you make it a success.",
    fields: ["Name", "Email", "Event idea", "Date"],
    action: { label: "Register", href: links.fundraise },
  },
  donate: {
    title: "Make a donation",
    text: "Donations are processed securely.",
    fields: [],
    action: { label: "Donate now", href: external.donate },
  },
};

export default function FormBlock({ kind }: { kind: Exclude<FormKind, "target450"> }) {
  const f = forms[kind];
  return (
    <section className="section" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className={`sheet sheet-stack ${s.card}`}>
          <div>
            <h2 className={s.title}>{f.title}</h2>
            <p className={s.text}>{f.text}</p>
          </div>
          {f.fields.length > 0 && (
            <div className={s.fields} aria-hidden="true">
              {f.fields.map((label) => (
                <span key={label} className={s.field}>{label}</span>
              ))}
            </div>
          )}
          <a className="btn btn-ink" href={f.action.href}>{f.action.label}</a>
          <p className={s.note}>Prototype: in the rebuild this form posts straight into Salesforce, with campaign source kept on every record.</p>
        </div>
      </div>
    </section>
  );
}
