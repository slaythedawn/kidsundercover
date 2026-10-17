/**
 * The website's own forms, replacing the Gravity Forms on the WordPress site. Questions and
 * options are the live forms' own (October 2026). Each submission is saved to the website
 * database and emailed to the right KUC inbox (see docs/FORMS.md).
 */

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkboxes" | "consent";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Help text under the label. */
  help?: string;
  options?: string[];
  autocomplete?: string;
  /** Sits beside the next half-width field on wider screens. */
  half?: boolean;
};

export type FormId = "contact" | "newsletter" | "target450";

export type FormDef = {
  id: FormId;
  title: string;
  intro?: string;
  submit: string;
  /** Where people land after sending. The page pushes the conversion event. */
  thanks: string;
  fields: Field[];
  /** Inbox that gets each submission. CONFIRM every address with KUC. */
  notify: string;
  /** Send to a different inbox depending on the answer to one question. */
  routeBy?: { field: string; to: Record<string, string> };
  /** Shown above the button and saved with the submission. */
  consent?: string;
};

const name: Field[] = [
  { name: "firstName", label: "First name", type: "text", required: true, autocomplete: "given-name", half: true },
  { name: "lastName", label: "Last name", type: "text", required: true, autocomplete: "family-name", half: true },
];

export const forms: Record<FormId, FormDef> = {
  contact: {
    id: "contact",
    title: "Send us a message",
    intro: "Our team will get back to you.",
    submit: "Send message",
    thanks: "/about/contact/thank-you/",
    fields: [
      ...name,
      { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
      {
        name: "topic",
        label: "I want help with...",
        type: "select",
        required: true,
        help: "Help us direct your message to the right team member so we can assist you as best we can.",
        options: ["Studio Program", "Scholarships", "Village 21", "Mobile Pods", "Fundraising enquiries", "Media and PR opportunities", "General enquiries"],
      },
      { name: "message", label: "Your message", type: "textarea", required: true, help: "Please let us know what's on your mind." },
    ],
    // CONFIRM: which inbox each topic goes to. Addresses are ones already published on kuc.org.au.
    notify: "kuc@kuc.org.au",
    routeBy: {
      field: "topic",
      to: {
        "Studio Program": "studio@kuc.org.au",
        Scholarships: "scholarship@kuc.org.au",
        "Village 21": "kuc@kuc.org.au",
        "Mobile Pods": "studio@kuc.org.au",
        "Fundraising enquiries": "fundraise@kuc.org.au",
        "Media and PR opportunities": "kuc@kuc.org.au",
        "General enquiries": "kuc@kuc.org.au",
      },
    },
  },

  newsletter: {
    id: "newsletter",
    title: "Get our newsletter",
    intro: "Stories, news and ways to help, every month.",
    submit: "Sign up",
    thanks: "/sign-up-for-our-newsletter/thank-you/",
    fields: [...name, { name: "email", label: "Email address", type: "email", required: true, autocomplete: "email" }],
    notify: "kuc@kuc.org.au",
    consent:
      "By providing your information, you agree to Kids Under Cover storing and handling your data and consent to receiving communications and marketing materials from us.",
  },

  target450: {
    id: "target450",
    title: "Back Target450",
    intro: "Leave a message of support, and tell us what you'd like to hear more about.",
    submit: "Send my support",
    thanks: "/target450/thank-you/",
    fields: [
      ...name,
      { name: "email", label: "Email", type: "email", required: true, autocomplete: "email" },
      { name: "message", label: "Leave a message of support", type: "textarea", help: "Your message may be used on our website." },
      {
        name: "interests",
        label: "I'd like to hear more about:",
        type: "checkboxes",
        options: [
          "The work you're doing with Government",
          "Kids Under Cover programs: Studios, Village 21, Mobile Pods, Scholarships and more",
          "Kids Under Cover fundraising efforts, including our Donate Your Car program",
          "How I can help promote the work of Kids Under Cover",
        ],
      },
    ],
    notify: "kuc@kuc.org.au",
  },
};

export const isFormId = (id: string): id is FormId => id in forms;
