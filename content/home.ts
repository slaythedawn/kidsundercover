/**
 * All homepage copy, links, numbers and photos live in this file.
 *
 * To change what the homepage says, edit the values here. Components in
 * /components only handle layout and behaviour, so most edits never need
 * to touch them.
 *
 * Rules for this file (from CLAUDE.md):
 * - Australian spelling, plain everyday language, no em dashes.
 * - Only use real Kids Under Cover facts, stories and photos. Never invent
 *   stats or donor stories. Anything still to confirm is marked "CONFIRM".
 */

export type Link = { label: string; href: string };

/** Main links used across the page. CONFIRM: paths against the live site. */
export const links = {
  donate: "https://www.kuc.org.au/donate/",
  donateYourCar: "https://www.kuc.org.au/donate-your-car/",
  carForm: "https://kuc.my.salesforce-sites.com/Donateyourcar",
  getSupport: "https://www.kuc.org.au/get-support/",
  studioProgram: "https://www.kuc.org.au/our-programs/studio-program/",
  village21: "https://www.kuc.org.au/our-programs/village-21/",
  scholarships: "https://www.kuc.org.au/our-programs/scholarships/",
  programs: "https://www.kuc.org.au/our-programs/",
  partnerships: "https://www.kuc.org.au/get-involved/partnerships/",
  giftsInWills: "https://www.kuc.org.au/get-involved/gifts-in-wills/",
  fundraise: "https://www.kuc.org.au/get-involved/fundraising/",
  target450: "https://www.kuc.org.au/target450/",
  stories: "https://www.kuc.org.au/stories/",
  about: "https://www.kuc.org.au/about/",
  ourTeam: "https://www.kuc.org.au/about/our-team/",
  supporters: "https://www.kuc.org.au/about/supporters/",
  impact: "https://www.kuc.org.au/our-impact/",
  getInvolved: "https://www.kuc.org.au/get-involved/",
  contact: "https://www.kuc.org.au/contact/",
  newsletter: "https://www.kuc.org.au/newsletter/",
};

export const site = {
  name: "Kids Under Cover",
  phone: "1800 801 633",
  logo: "/images/kuc-logo.png",
  donateLabel: "Donate",
  contactLabel: "Contact",
};

export const nav: Link[] = [
  { label: "About", href: links.about },
  { label: "Our programs", href: links.programs },
  { label: "Our impact", href: links.impact },
  { label: "Get involved", href: links.getInvolved },
  { label: "Stories", href: links.stories },
  { label: "Donate Your Car", href: links.donateYourCar },
];

/** 1. Hero */
export const hero = {
  eyebrow: "Stop youth homelessness before it starts",
  // The headline is split so the second part can be set in the warm italic serif.
  titleStart: "A room of their own,",
  titleAccent: "close to home.",
  image: "/images/mast.jpg",
  imageAlt: "A mum and her daughter sharing a cup of tea outside a Kids Under Cover studio",
  // Frosted pill in the top right of the photo (desktop) and the sticky bar (mobile).
  donatePrompt: "Help a young person stay home",
};

/**
 * 1. The AI front door.
 * Each intent shows an instant answer with next steps. Free text questions go
 * to /api/assistant, which uses Claude when an API key is set, and these
 * intents as a fallback when it isn't.
 */
export type Intent = {
  id: string;
  label: string;
  reply: string;
  links: Link[];
  /** Words that point a free text question at this intent when Claude isn't connected. */
  keywords: string[];
};

export const assistant = {
  label: "Kids Under Cover assistant",
  question: "What brings you here today?",
  placeholder: 'Or ask anything, like "Can I donate a car that doesn\'t run?"',
  thinking: "Finding the best place for you...",
  fallback:
    "I'm not sure I've got the right answer for that one. Our team can help on 1800 801 633, or pick one of the options above.",
  intents: [
    {
      id: "donate",
      label: "I want to donate",
      reply:
        "Thank you. Your gift helps build studios and fund education that keep young people close to family, school and community. You can give once or every month.",
      links: [
        { label: "Make a donation", href: links.donate },
        { label: "Leave a gift in your will", href: links.giftsInWills },
      ],
      // "donate" on its own is left out so "donate a car" goes to the car answer.
      // Questions that only say "donate" still land here (see lib/assistant.ts).
      keywords: ["give", "gift", "money", "monthly", "regular", "tax", "receipt", "one off"],
    },
    {
      id: "car",
      label: "I have a car to donate",
      reply:
        "Your old car can help build a studio for a young person. Tell us about it and we'll take care of the rest.",
      links: [
        { label: "Start your car donation", href: links.carForm },
        { label: "How Donate Your Car works", href: links.donateYourCar },
      ],
      keywords: ["car", "vehicle", "ute", "van", "truck", "motorbike", "boat", "scrap", "removal", "rego"],
    },
    {
      id: "support",
      label: "I need support",
      reply:
        "We're here to help young people and families at risk of homelessness. Find out about our Studio Program and other support. If someone is in danger right now, call 000.",
      links: [
        { label: "Get support", href: links.getSupport },
        { label: "About the Studio Program", href: links.studioProgram },
      ],
      keywords: ["help", "support", "homeless", "housing", "apply", "studio", "need", "room", "eligible"],
    },
    {
      id: "partner",
      label: "I want to partner with you",
      reply:
        "Businesses, builders and community groups help us build more studios every year. Let's talk about what a partnership could look like.",
      links: [
        { label: "Partner with us", href: links.partnerships },
        { label: "Fundraise with us", href: links.fundraise },
      ],
      keywords: ["partner", "partnership", "business", "company", "corporate", "workplace", "sponsor", "volunteer"],
    },
    {
      id: "carer",
      label: "I'm a carer",
      reply:
        "We work with families and kinship carers so young people can stay close to home. A studio in the backyard can give everyone a bit more room.",
      links: [
        { label: "Get support", href: links.getSupport },
        { label: "About the Studio Program", href: links.studioProgram },
      ],
      keywords: ["carer", "kinship", "foster", "grandparent", "grandchild", "family", "care"],
    },
  ] satisfies Intent[],
};

/** 2. Impact intro with the hand made illustration */
export const impact = {
  badge: "Updated every month",
  headlineStart: "Tonight,",
  headlineHighlight: "1,000+",
  headlineEnd: "young people will sleep safely in a studio.",
  body: "We build homes and fund education that keep young people close to family, school and community, before crisis hits.",
  stats: [
    { value: "675+", label: "studios built" },
    { value: "$20M+", label: "raised by donated cars" },
    { value: "450", label: "Target450 goal", accent: true },
  ],
};

/** 3. Programs as printed photos */
export const programs = {
  title: "How we help",
  seeAll: { label: "See all programs", href: links.programs },
  items: [
    {
      name: "Studio Program",
      blurb: "Backyard studios that keep young people close to family and school.",
      image: "/images/pair.jpg",
      imageAlt: "A young man and a support worker bumping fists outside a studio",
      href: links.studioProgram,
    },
    {
      name: "Village 21",
      blurb: "Supported accommodation for the move to independent living.",
      image: "/images/studios.jpg",
      imageAlt: "Green Village 21 studios with pot plants out the front",
      href: links.village21,
    },
    {
      name: "Scholarships",
      blurb: "Education support to finish school, train and build a future.",
      image: "/images/junior.jpg",
      imageAlt: "Junior, a scholarship recipient, smiling in a red shirt",
      href: links.scholarships,
    },
    {
      name: "Get support",
      blurb: "Resources for young people, families and carers.",
      // CONFIRM: swap for a dedicated support photo from the KUC library.
      image: "/images/handover.jpg",
      imageAlt: "A family and the Kids Under Cover team outside a new studio",
      href: links.getSupport,
    },
  ],
};

/** 4. The neighbourhood: animated scale. Each icon stands for ten. */
export const neighbourhood = {
  title: "A whole neighbourhood, built one backyard at a time.",
  lede: "Every small house below stands for ten. Watch the numbers fill in, then see how far there is still to go.",
  note: "Figures from the Kids Under Cover website. Each icon represents ten.",
  modes: [
    {
      id: "studios",
      tab: "Studios built",
      value: 675,
      plus: true,
      caption: "studios built in the backyards of family and carers' homes.",
      icon: "house",
      key: "One house is ten studios",
      // Icons to draw. Each one stands for ten, so 675 studios is about 68 houses.
      filledIcons: 68,
      todoIcons: 0,
    },
    {
      id: "people",
      tab: "Young people tonight",
      value: 1000,
      plus: true,
      caption: "young people sleep safely in a Kids Under Cover studio every night.",
      icon: "person",
      key: "One figure is ten young people",
      filledIcons: 100,
      todoIcons: 0,
    },
    {
      id: "target",
      tab: "Target450",
      value: 450,
      plus: false,
      caption:
        "more young people housed every night. That is the goal of Target450, and where your support goes next.",
      icon: "person",
      key: "Dashed figures are still to be housed",
      // The 1,000+ housed tonight, then 45 dashed figures for the 450 still to go.
      // CONFIRM: progress to date against Target450.
      filledIcons: 100,
      todoIcons: 45,
    },
  ],
} as const;

/** Ways to support us (icon row) */
export const ways = {
  title: "Ways to support us",
  items: [
    { label: "Make a donation", icon: "heart", href: links.donate },
    { label: "Donate Your Car", icon: "car", href: links.donateYourCar },
    { label: "Gift in your will", icon: "will", href: links.giftsInWills },
    { label: "Partner with us", icon: "handshake", href: links.partnerships },
    { label: "Fundraise with us", icon: "piggy", href: links.fundraise },
  ],
} as const;

/** 5. Target450 on paper */
export const target450 = {
  eyebrow: "Target450",
  titleStart: "Help us house an extra 450 young people",
  titleAccent: "every night.",
  cta: { label: "I want to help", href: links.target450 },
};

/** 6. Stories as printed photos. Titles and photos from kuc.org.au. */
export const stories = {
  title: "Stories",
  viewAll: { label: "View all stories", href: links.stories },
  featured: {
    tag: "Story",
    titleStart: "Jacinta and",
    titleAccent: "Holly's story",
    summary: "A mum's story of Holly's time in homelessness accommodation, and what came next.",
    image: "/images/holly.jpg",
    imageAlt: "Holly sitting on the steps of her studio",
    href: links.stories, // CONFIRM: direct story URL
  },
  more: [
    { tag: "Village 21", title: "Village life", image: "/images/village.jpg", imageAlt: "Two young men cooking together", href: links.stories },
    { tag: "Scholarships", title: "Meeting Junior", image: "/images/junior.jpg", imageAlt: "Junior smiling", href: links.stories },
    { tag: "Village 21", title: "Bairnsdale launch", image: "/images/studios.jpg", imageAlt: "New Village 21 studios", href: links.stories },
    // No photo yet, so this one shows a drawn car. CONFIRM: add the story photo.
    { tag: "Donate Your Car", title: "Nana's car leaves a legacy", image: null, imageAlt: "", href: links.stories },
  ],
};

export const footer = {
  columns: [
    {
      title: "About",
      links: [
        { label: "Our story", href: links.about },
        { label: "Our team", href: links.ourTeam },
        { label: "Supporters", href: links.supporters },
      ],
    },
    {
      title: "Programs",
      links: [
        { label: "Studio Program", href: links.studioProgram },
        { label: "Village 21", href: links.village21 },
        { label: "Scholarships", href: links.scholarships },
      ],
    },
    {
      title: "Get involved",
      links: [
        { label: "Donate", href: links.donate },
        { label: "Donate Your Car", href: links.donateYourCar },
        { label: "Gifts in wills", href: links.giftsInWills },
      ],
    },
  ],
  newsletter: { label: "Sign up for our newsletter", href: links.newsletter },
  acknowledgement:
    "Kids Under Cover acknowledges the Traditional Custodians of the land on which we live and work.",
};
