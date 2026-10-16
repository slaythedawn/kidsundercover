/**
 * Site wide settings: links, the main menu, the footer and the donation asks
 * used at the end of every page.
 *
 * Paths match the live kuc.org.au addresses wherever a page is kept, so
 * existing search rankings carry over. Pages that were merged or retired
 * redirect in redirects.ts.
 */

export type Link = { label: string; href: string };

/**
 * Giving journeys that leave the site. Where each one lives today:
 * - One-off gifts: Giveasy (donatenow.kuc.org.au). Cards, Apple Pay, Google Pay, PayPal.
 * - Monthly gifts: the Salesforce widget on the current /regular-donation/ page, or by phone.
 * - Cars: the Salesforce site form. Studio applications: Microsoft Forms.
 * See docs/INTEGRATIONS.md for the plan to bring these into the site.
 */
export const external = {
  donate: "https://donatenow.kuc.org.au/general/donate",
  // Monthly gifts are taken by the Salesforce NPSP Plus form embedded on the regular giving page (see npspForms).
  monthlyForm: "/regular-donation/#give",
  // CONFIRM with Giveasy: the query parameter that pre-fills the amount, if any. Empty sends people to choose again.
  donateAmountParam: "",
  carForm: "https://kuc.my.salesforce-sites.com/Donateyourcar",
  // Salesforce NPSP Plus donation forms, embedded with KUC's drop-in script (S23). Each form is set up in Salesforce
  // with its own campaign, so gifts land against the right appeal. IDs from the live WordPress pages (October 2026).
  npspDropIn: "https://connect.kuc.org.au/resource/npsp_plus__DonateDropIn/dropin.js",
  npspForm: "https://connect.kuc.org.au/npsp_plus__DonateDropIn?form=",
  peaksOfHope: "https://inspiredadventures.com.au/event/kidsundercover-peaksofhope-2027/",
  facebook: "https://www.facebook.com/KidsUnderCover",
  instagram: "https://www.instagram.com/kidsundercover",
  linkedin: "https://www.linkedin.com/company/kids-under-cover",
  youtube: "https://www.youtube.com/user/Kidsundercover2010",
};

export const links = {
  // Giving
  // Every Donate button goes to our donation page first: people see what their gift does, can
  // choose monthly, and campaign tags and tracking carry through to Giveasy.
  donate: "/get-involved/donate/",
  waysToGive: "/get-involved/",
  monthly: "/regular-donation/",
  donateYourCar: "/get-involved/donate-your-car/",
  carForm: external.carForm,
  giftsInWills: "/get-involved/bequests/",
  fundraise: "/get-involved/community-fundraising/",
  workplaceGiving: "/get-involved/workplace-giving/",
  christmas: "/christmas-appeal/",
  partnerships: "/get-involved/corporate-business-partnerships/",
  target450: "/target450/",
  workWithUs: "/get-involved/work-with-us/",

  // Our work
  programs: "/our-programs/",
  studioProgram: "/our-programs/studio-program/",
  village21: "/our-programs/village21/",
  village21Bairnsdale: "/our-programs/village21bairnsdale/",
  village21Preston: "/our-programs/village21preston/",
  moorumbina: "/our-programs/moorumbina-mongurnallin/",
  scholarships: "/our-programs/scholarships/",
  applyScholarship: "/our-programs/scholarships/apply-for-a-scholarship/",
  supportYoungPeople: "/our-programs/resources-for-young-people/",
  supportCarers: "/our-programs/resources-for-carers/",
  getSupport: "/our-programs/resources-for-young-people/",

  // Impact
  impact: "/our-impact/",
  research: "/our-impact/research-and-resources/",
  facts: "/our-impact/the-facts-and-statistics-on-youth-homelessness/",
  publications: "/our-impact/publications/",
  whereAreTheyNow: "/our-impact/where-are-they-now/",
  stories: "/stories/",

  // About
  about: "/about/",
  ourStory: "/about/our-story/",
  ourTeam: "/about/our-team/",
  supporters: "/about/our-supporters/",
  mediaCentre: "/about/media-centre/",
  contact: "/about/contact/",
  newsletter: "/sign-up-for-our-newsletter/",
  privacy: "/privacy-feedback/",
  terms: "/terms-conditions/",
};

export const site = {
  name: "Kids Under Cover",
  url: "https://www.kuc.org.au",
  phone: "1800 801 633",
  logo: "/images/kuc-logo.png",
  donateLabel: "Donate",
  contactLabel: "Contact",
  abn: "76 604 592 013", // From KUC's Giveasy donation page
};

/**
 * The main menu. Four groups instead of six, with giving pulled forward:
 * every group ends with a way to help, and "Ways to give" sits next to the
 * Donate button.
 */
export type NavGroup = {
  label: string;
  href: string;
  intro: string;
  items: (Link & { note?: string })[];
  feature?: Link & { note: string };
};

export const nav: NavGroup[] = [
  {
    label: "Our work",
    href: links.programs,
    intro: "Homes and education that keep young people close to family, school and community.",
    items: [
      { label: "Studio Program", href: links.studioProgram, note: "Backyard studios for families and carers" },
      { label: "Village 21", href: links.village21, note: "Supported accommodation for young people" },
      { label: "Scholarships", href: links.scholarships, note: "Help to finish school, train and study" },
      { label: "Get support", href: links.getSupport, note: "Help for young people, families and carers" },
    ],
    feature: { label: "Fund a studio", href: links.waysToGive, note: "See how your gift builds a room of their own" },
  },
  {
    label: "Our impact",
    href: links.impact,
    intro: "What changes when a young person has a safe place to stay.",
    items: [
      { label: "Our impact", href: links.impact },
      { label: "Youth homelessness facts", href: links.facts },
      { label: "Research and resources", href: links.research },
      { label: "Publications and reports", href: links.publications },
      { label: "Where are they now", href: links.whereAreTheyNow },
      { label: "Stories", href: links.stories },
    ],
    feature: { label: "Target450", href: links.target450, note: "450 more young people housed every night" },
  },
  {
    label: "Ways to give",
    href: links.waysToGive,
    intro: "Every gift keeps a young person close to home.",
    items: [
      { label: "Donate now", href: links.donate },
      { label: "Give monthly", href: links.monthly },
      { label: "Donate your car", href: links.donateYourCar },
      { label: "Gift in your will", href: links.giftsInWills },
      { label: "Fundraise for us", href: links.fundraise },
      { label: "Partner with us", href: links.partnerships },
      { label: "Workplace giving", href: links.workplaceGiving },
    ],
    feature: { label: "Donate your car", href: links.donateYourCar, note: "Turn an old car into a room of their own" },
  },
  {
    label: "About",
    href: links.about,
    intro: "Who we are and how to reach us.",
    items: [
      { label: "Our story", href: links.ourStory },
      { label: "Our team", href: links.ourTeam },
      { label: "Our supporters", href: links.supporters },
      { label: "Media centre", href: links.mediaCentre },
      { label: "Work with us", href: links.workWithUs },
      { label: "Contact us", href: links.contact },
    ],
  },
];

export const footer = {
  columns: [
    { title: "Our work", links: nav[0].items.map(({ label, href }) => ({ label, href })) },
    { title: "Our impact", links: nav[1].items.map(({ label, href }) => ({ label, href })) },
    { title: "Ways to give", links: nav[2].items.map(({ label, href }) => ({ label, href })) },
    { title: "About", links: nav[3].items.map(({ label, href }) => ({ label, href })) },
  ],
  newsletter: { label: "Sign up for our newsletter", href: links.newsletter },
  legal: [
    { label: "Privacy", href: links.privacy },
    { label: "Terms and conditions", href: links.terms },
  ],
  social: [
    { label: "Facebook", href: external.facebook },
    { label: "Instagram", href: external.instagram },
    { label: "LinkedIn", href: external.linkedin },
    { label: "YouTube", href: external.youtube },
  ],
  acknowledgement:
    "Kids Under Cover acknowledges the Traditional Custodians of the land on which we live and work.",
};

/**
 * The donation ask that closes every page. Each page picks one with `cta`
 * in its front matter, so the ask matches what the visitor just read.
 */
export type CtaKey = "donate" | "monthly" | "car" | "bequest" | "partner" | "fundraise" | "support" | "scholarship" | "target450";

export const ctas: Record<CtaKey, { eyebrow: string; title: string; accent: string; body: string; primary: Link; secondary?: Link }> = {
  donate: {
    eyebrow: "Donate",
    title: "Help a young person",
    accent: "stay close to home.",
    body: "Your gift helps build studios and fund education that keep young people safe, housed and connected.",
    primary: { label: "Donate now", href: links.donate },
    secondary: { label: "Give monthly", href: links.monthly },
  },
  monthly: {
    eyebrow: "Give monthly",
    title: "A small gift each month,",
    accent: "a room that lasts.",
    body: "Regular gifts let us plan ahead and say yes to more families who need a studio.",
    primary: { label: "Give monthly", href: links.monthly },
    secondary: { label: "Make a one off gift", href: links.donate },
  },
  car: {
    eyebrow: "Donate Your Car",
    title: "Your old car can build",
    accent: "a room of their own.",
    body: "We collect it, sell it and put the money into studios for young people at risk of homelessness.",
    primary: { label: "Start your car donation", href: links.carForm },
    secondary: { label: "How it works", href: links.donateYourCar },
  },
  bequest: {
    eyebrow: "Gift in your will",
    title: "Leave a gift that",
    accent: "keeps young people home.",
    body: "A gift in your will helps young people for years to come.",
    primary: { label: "Find out about bequests", href: links.giftsInWills },
    secondary: { label: "Talk to our team", href: links.contact },
  },
  partner: {
    eyebrow: "Partner with us",
    title: "Build something",
    accent: "that lasts.",
    body: "Businesses, builders and community groups help us build more studios every year.",
    primary: { label: "Partner with us", href: links.partnerships },
    secondary: { label: "Donate", href: links.donate },
  },
  fundraise: {
    eyebrow: "Fundraise",
    title: "Rally your people",
    accent: "for young people.",
    body: "Run, ride, climb or host your own event and every dollar goes towards a safe place to stay.",
    primary: { label: "Start fundraising", href: links.fundraise },
    secondary: { label: "Donate", href: links.donate },
  },
  support: {
    eyebrow: "Need support?",
    title: "You don't have to",
    accent: "work it out alone.",
    body: "Find services and resources for young people, families and carers. If someone is in danger right now, call 000.",
    primary: { label: "Get support", href: links.getSupport },
    secondary: { label: "Resources for carers", href: links.supportCarers },
  },
  scholarship: {
    eyebrow: "Scholarships",
    title: "Help a young person",
    accent: "finish what they started.",
    body: "Scholarships cover the costs that stand between a young person and their education.",
    primary: { label: "Donate", href: links.donate },
    secondary: { label: "Apply for a scholarship", href: links.applyScholarship },
  },
  target450: {
    eyebrow: "Target450",
    title: "Help us house an extra 450 young people",
    accent: "every night.",
    body: "Target450 is our goal for the years ahead, and where your support goes next.",
    primary: { label: "Donate now", href: links.donate },
    secondary: { label: "About Target450", href: links.target450 },
  },
};
