/**
 * The sign-off sheet at /design/sections/: every section template with a real
 * example, and the page templates built from them. Examples use real KUC copy
 * taken from the pilot pages.
 */
import type { PageSection } from "@/lib/sections";

export type SectionSpec = { code: string; name: string; purpose: string; usedOn: string; example: PageSection };

const form = "https://kuc.my.salesforce-sites.com/Donateyourcar";

export const sectionSpecs: SectionSpec[] = [
  {
    code: "S01",
    name: "Page hero",
    purpose:
      "Opens every page. Two styles: split (title beside a tilted photo) for most pages, and photo (big photo with the title on a paper sheet) for campaign landing pages. Breadcrumbs sit above the title.",
    usedOn: "Every page. Photo style: Donate Your Car awareness page and future campaigns.",
    example: { type: "text", body: "See the top of this page for the split style, and [the awareness page](/get-involved/donate-your-car/their-new-beginning/) for the photo style." },
  },
  {
    code: "S02",
    name: "Lead statement",
    purpose: "One big sentence that tells people what the page is about, with the key phrase highlighted and an optional headline number beside it.",
    usedOn: "Program pages, Ways to give, About, Donate Your Car hub.",
    example: {
      type: "lead",
      eyebrow: "Preventing young people from experiencing homelessness",
      text: "Each studio provides a **stable space for a young person to grow and study** while keeping them connected to their family and reducing the risk of them being forced to leave home prematurely.",
      aside: { value: "1,000", label: "young people housed by Kids Under Cover studios each night in Victoria", note: "Updated January 2024." },
    },
  },
  {
    code: "S03",
    name: "Text and photo",
    purpose: "The workhorse. Copy beside a printed photo, with optional tick points and buttons. Alternate sides down a page with `flip`, so photos never sit full width between headings.",
    usedOn: "Almost every content page. Replaces the full width photos on the current pages.",
    example: {
      type: "split",
      eyebrow: "Studio design",
      title: "Built to last, and to keep families close",
      body: "Our studios are sustainable, heat efficient and durable, constructed from Durra Panel, a sustainably sourced building material produced in Bendigo.",
      points: ["Each studio includes a **bathroom**", "A **study nook in each bedroom**", "**No kitchen**, so young people stay connected to family at meal times"],
      image: "https://www.kuc.org.au/wp-content/uploads/2024/02/studio-program-montage-1.jpg",
    },
  },
  {
    code: "S04",
    name: "Feature cards",
    purpose: "Two to four short points side by side, each with an icon or photo, and an optional link. For options, benefits or parts of a program.",
    usedOn: "Studio Program (after the build), Ways to give, Donate Your Car (drop off or collection), Scholarships, Village 21.",
    example: {
      type: "features",
      columns: 2,
      title: "Drop it off, or we'll collect it",
      items: [
        { icon: "gift", title: "Drop off and get a $100 eGift Card", text: "If your vehicle is safe and driveable, drop it off at a designated auction site and we'll thank you with a $100 Smart Prezzee eGift Card.", href: "/get-involved/donate-your-car-drop-off-locations/", label: "Find a drop-off location" },
        { icon: "truck", title: "We can arrange collection", text: "We collect vehicles within metropolitan Melbourne, Sydney, Newcastle, Brisbane, Townsville, Adelaide, Perth, Darwin and Hobart." },
      ],
    },
  },
  {
    code: "S05",
    name: "Steps",
    purpose: "A process in order. Numbered for how-to steps, or a journey with icons for a story like driveway to auction to home. Runs across on desktop and down on phones.",
    usedOn: "Donate Your Car (all four pages), Studio Program (how it's built), scholarship and studio applications.",
    example: {
      type: "steps",
      style: "journey",
      title: "From your driveway",
      accent: "to a young person's new home.",
      items: [
        { icon: "car", title: "Your driveway", text: "You tell us about the car you want to donate." },
        { icon: "truck", title: "On its way", text: "Our team arranges transporting your vehicle to the auction house." },
        { icon: "gavel", title: "Sold at auction", text: "The proceeds go directly to fund Kids Under Cover programs." },
        { icon: "studio", title: "A room of their own", text: "We deliver studio accommodation and other supports to young people." },
      ],
    },
  },
  {
    code: "S06",
    name: "Number band",
    purpose: "Three or four headline figures on a yellow band with a torn paper edge. Every figure needs a source or date in the note.",
    usedOn: "Facts and stats, Our impact, Donate Your Car awareness, Target450.",
    example: {
      type: "stats",
      title: "What donated cars have done",
      items: [
        { value: "$23M+", label: "raised by the Donate Your Car® program to date" },
        { value: "1,000", label: "young people housed by Kids Under Cover studios each night in Victoria" },
        { value: "100%", label: "tax deductible" },
      ],
      note: "Studio figure updated January 2024.",
    },
  },
  {
    code: "S07",
    name: "Fact cards",
    purpose: "Sourced figures as cards beside a photo that stays put as you scroll. The number is highlighted, the sentence explains it, and the source sits underneath.",
    usedOn: "Facts and stats, research pages, Target450, media releases with figures.",
    example: {
      type: "facts",
      title: "Young people leaving care",
      image: "https://www.kuc.org.au/wp-content/uploads/2024/04/majestic-lukas-rtmQ8ESC4PE-unsplash-scaled-e1713931133825-1024x1216.jpg",
      items: [
        { value: "35%", text: "of young people in state care end up homeless after they turn 18." },
        { value: "50%", text: "of state care leavers will be unemployed, in jail, homeless or had become a new parent within one year." },
      ],
      source: "[Home Stretch campaign](https://thehomestretch.org.au/)",
    },
  },
  {
    code: "S08",
    name: "Quote",
    purpose: "One real voice, large, with a photo and a link to the full story. Works on paper, yellow or dark backgrounds.",
    usedOn: "Program pages, Donate Your Car pages, bequests, scholarships.",
    example: {
      type: "quote",
      tone: "sun",
      quote: "I was relieved that I had a permanent desk without needing to use kitchen tables, that I was free of distractions.",
      name: "Jesse",
      role: "Received a studio at 18, now studying medicine",
      image: "https://www.kuc.org.au/wp-content/uploads/2024/02/3-2-1024x1024.png",
      href: "/studio-program-helps-launch-medical-career-jesses-story/",
      linkLabel: "Read Jesse's story",
    },
  },
  {
    code: "S09",
    name: "Photo strip",
    purpose: "A row of printed photos with captions. Swipes sideways on phones. For pages with several photos that don't each need their own text.",
    usedOn: "Village 21, Moorumbina Mongurnallin, events, Our story.",
    example: {
      type: "gallery",
      title: "Studios in the backyard",
      images: [
        { src: "https://www.kuc.org.au/wp-content/uploads/2024/02/studio-program-montage-3.jpg" },
        { src: "https://www.kuc.org.au/wp-content/uploads/2024/02/studio-program-montage-4.jpg" },
        { src: "https://www.kuc.org.au/wp-content/uploads/2024/02/studio-program-montage-5.jpg" },
      ],
    },
  },
  {
    code: "S10",
    name: "Video",
    purpose: "A video in a printed frame with a play button. YouTube only loads when someone presses play, so pages stay fast.",
    usedOn: "Donate Your Car, Village 21 and studio virtual tours, campaign pages.",
    example: { type: "video", eyebrow: "Watch", title: "Your car.", accent: "Their new beginning.", youtube: "-Vmt1-5dVN4", label: "Your car. Their new beginning." },
  },
  {
    code: "S11",
    name: "Checklist",
    purpose: "What's in and what's out, side by side. Ticks on a white card, crosses on a dashed card.",
    usedOn: "Donate Your Car (what we accept), scholarships (what you can spend it on), studio eligibility.",
    example: {
      type: "checklist",
      title: "What kinds of vehicles do you accept?",
      yes: { title: "We accept", items: ["Cars", "Vans", "Motorbikes", "Caravans", "Trucks", "Buses", "Tractors", "Boats on trailers"] },
      no: { title: "We can't accept", items: ["Smashed windows", "Major panel damage", "Mould", "Missing parts"] },
    },
  },
  {
    code: "S12",
    name: "Questions",
    purpose: "An accordion of FAQs. Also adds FAQ schema so Google can show the answers in search results.",
    usedOn: "Donate Your Car, bequests, scholarships, studio applications, Ways to give.",
    example: {
      type: "faq",
      title: "Donate Your Car FAQs",
      items: [
        { question: "Can I donate a car that isn't running?", answer: "Yes. We're able to accept cars that aren't running, as long as the battery and engine are both intact and nothing has been removed from the vehicle." },
        { question: "Will I receive a tax receipt for my car donation?", answer: "Yes, all vehicles donated to Kids Under Cover are tax deductible. You can expect your receipt within 8 to 12 weeks." },
      ],
    },
  },
  {
    code: "S13",
    name: "Callout",
    purpose: "A boxed next step for one audience, like support workers applying for a studio, or people who want to call first.",
    usedOn: "Program pages (how to apply), support pages, Donate Your Car (talk to the team), contact.",
    example: {
      type: "callout",
      icon: "home",
      eyebrow: "Applying for a studio",
      title: "Studios are applied for by a support worker",
      body: "If you are a young person at risk of homelessness, or someone who cares for one, you will need to contact a Community Service Organisation who can apply for a studio on your behalf.",
      actions: [{ label: "How to apply for a studio", href: "/our-programs/studio-program/kids-under-cover-studio-program-applications/" }],
    },
  },
  {
    code: "S14",
    name: "Story cards",
    purpose: "Three or six stories, picked by address or the latest from one program. Keeps stories in front of people on every topic page.",
    usedOn: "Program pages, Donate Your Car, bequests, scholarships, the homepage.",
    example: { type: "stories", title: "Donor stories", urls: ["/generous-mr-fix-it-donates-his-ninth-car-to-kids-under-cover/", "/a-mustang-with-heart-tarquins-incredible-donation/", "/the-art-of-altruism/"] },
  },
  {
    code: "S15",
    name: "Jump links",
    purpose: "A sticky row of chips that skip to sections further down. Built automatically from the sections below it.",
    usedOn: "Long pages: Studio Program, Facts and stats, Donate Your Car hub, bequests.",
    example: { type: "text", body: "Shown on [Studio Program](/our-programs/studio-program/) and [Facts and stats](/our-impact/the-facts-and-statistics-on-youth-homelessness/). It sticks to the top of the screen as you scroll." },
  },
  {
    code: "S16",
    name: "Trust strip",
    purpose: "Four short reassurances in a dark strip, straight under the hero, answering the first worries before people scroll.",
    usedOn: "Giving pages: Donate Your Car (all four), Donate, Give monthly, bequests.",
    example: { type: "trust", items: [{ icon: "receipt", text: "100% tax deductible" }, { icon: "truck", text: "We arrange collection" }, { icon: "car", text: "Running or not" }, { icon: "clock", text: "Tax receipt in 8 to 12 weeks" }] },
  },
  {
    code: "S17",
    name: "Rich text",
    purpose: "Plain copy in a readable column, for anything that doesn't fit a template.",
    usedOn: "Privacy, terms, policies, long research summaries.",
    example: { type: "text", title: "Privacy and feedback", body: "Long form copy sits in a comfortable reading width, with headings, lists, links and tables styled to match the site." },
  },
  {
    code: "S18",
    name: "Giving ask",
    purpose: "The yellow giving card. Closes every page with the ask that matches the topic (cars, monthly, bequests, scholarships, partners), and can also sit mid page.",
    usedOn: "Every page, set by `cta` in the page's file.",
    example: { type: "ask", cta: "car" },
  },
  {
    code: "S19",
    name: "Form start",
    purpose: "Everything someone needs before they open a form, then one big button. Used where the form lives on another system (Salesforce, Microsoft Forms).",
    usedOn: "Donate Your Car (consideration and high intent), studio and scholarship applications, fundraising sign up.",
    example: {
      type: "formstart",
      title: "Tell us about your car",
      body: "Complete the form to tell us about the car you want to donate. Our team will get in touch to arrange the rest.",
      need: ["Details of the vehicle you want to donate", "The name of the last or current registered owner, as the tax receipt is issued in their name"],
      action: { label: "Start your car donation", href: form },
      help: "Prefer to talk? Call **1800 801 633**.",
    },
  },
  {
    code: "S20",
    name: "Page cards",
    purpose: "Links to other pages as printed photo cards, chosen by address or this page's children.",
    usedOn: "Section landing pages (Our work, Our impact, About), Keep exploring at the end of pages.",
    example: { type: "pages", title: "Keep exploring", urls: ["/our-programs/studio-program/", "/our-impact/the-facts-and-statistics-on-youth-homelessness/", "/get-involved/donate-your-car/"] },
  },
  {
    code: "S21",
    name: "Resource hub",
    purpose: "Every report and PDF in one place: featured reports as covers, then shelves by type with search. When a report gets its own page, the hub links there and keeps the PDF as a download.",
    usedOn: "Publications, Research and resources.",
    example: { type: "resources", categories: ["Annual reports", "Research"] },
  },
];

/** Page templates: which sections each kind of page uses, in order. */
export const pageTemplates: { name: string; for: string; sections: string; example?: { label: string; href: string } }[] = [
  {
    name: "Program page",
    for: "Studio Program, Village 21, Village 21 Bairnsdale and Preston, Moorumbina Mongurnallin, Scholarships",
    sections: "S01 split, S15, S02, S03 alternating, S05, S04, S08 on yellow, S03, S14, S13 how to apply, S20, S18",
    example: { label: "Studio Program", href: "/our-programs/studio-program/" },
  },
  {
    name: "Facts and research page",
    for: "Facts and stats, research and resources items, Our impact",
    sections: "S01 split, S15, S06, S07 alternating sides and tones, S13 what we do about it, S18 monthly",
    example: { label: "Facts and stats", href: "/our-impact/the-facts-and-statistics-on-youth-homelessness/" },
  },
  {
    name: "Giving hub",
    for: "Donate Your Car, Ways to give, bequests, partnerships, community fundraising",
    sections: "S01 split with two buttons, S16, S15, S02, S05, S11 or S04, S03, S10, S08, S14, S12, S13, S18",
    example: { label: "Donate Your Car hub", href: "/get-involved/donate-your-car/" },
  },
  {
    name: "Campaign: awareness",
    for: "Social and video campaigns for people who haven't thought about giving yet",
    sections: "S01 photo, S03 a young person's story, S08 dark, S05 journey, S10, S08 donor, S06, S13 to the consideration page",
    example: { label: "Your car. Their new beginning.", href: "/get-involved/donate-your-car/their-new-beginning/" },
  },
  {
    name: "Campaign: consideration",
    for: "Search and retargeting, for people weighing it up",
    sections: "S01 split, S16, S05, S11, S04, S03, S08, S03, S12, S19",
    example: { label: "How donating your car works", href: "/get-involved/donate-your-car/how-it-works/" },
  },
  {
    name: "Campaign: high intent",
    for: "Brand search and people ready to act now",
    sections: "S01 split with the form button, S16, S19, S05, S12",
    example: { label: "Donate your car today", href: "/get-involved/donate-your-car/start/" },
  },
  {
    name: "Resource hub",
    for: "Publications, Research and resources",
    sections: "S01 split, S21, S20, S18",
    example: { label: "Publications", href: "/our-impact/publications/" },
  },
  {
    name: "Story",
    for: "All 70 stories and 27 media releases",
    sections: "S01 split (no intro), article with a sticky giving card, S14 read next, S18 matched to the story",
    example: { label: "Jesse's story", href: "/studio-program-helps-launch-medical-career-jesses-story/" },
  },
  {
    name: "Basic page",
    for: "Privacy, terms, policies, small utility pages",
    sections: "S01 plain, S17, S18 where it fits",
  },
];
