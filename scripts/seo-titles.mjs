// Title tags and meta descriptions for every page, from the Ahrefs research in
// docs/SEO.md. Titles leave off the brand; the site adds " | Kids Under Cover".
// Run: node scripts/seo-titles.mjs  (writes seoTitle and description into each page's front matter)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const seo = {
  "/about/": ["About Us | Youth Homelessness Charity", "Kids Under Cover is an Australian not-for-profit preventing youth homelessness since 1989, with backyard studios, scholarships and supported housing."],
  "/about/contact/": ["Contact Us", "Call Kids Under Cover on 1800 801 633 or send us a message. Find our address, email and the right team for donations, cars, studios and scholarships."],
  "/about/contact/kids-under-cover-charitable-status-and-tax-information/": ["Charitable Status, ABN and Tax Information", "Kids Under Cover's ABN, ACNC registration, Public Benevolent Institution and DGR status, and how to give safely. Donations over $2 are tax deductible."],
  "/about/contact/privacy-policy/": ["Privacy Policy", "How Kids Under Cover collects, uses, stores and protects your personal information, and how to contact us about your privacy."],
  "/about/contact/terms-and-conditions/": ["Terms and Conditions", "The terms and conditions for using the Kids Under Cover website and making donations."],
  "/about/media-centre/": ["Media Centre and Media Releases", "Media releases and news from Kids Under Cover on youth homelessness, our studios, Village 21 and scholarships."],
  "/about/moorumbina-mongurnallin-partners/": ["Moorumbina Mongurnallin Partners", "The partners and supporters who made Moorumbina Mongurnallin possible, supported housing for First Nations young people leaving care."],
  "/about/our-story/": ["Our Story | Preventing Youth Homelessness", "Founded in 1989 by Ken Morgan, Kids Under Cover builds studios and funds scholarships so young people at risk of homelessness can stay close to home."],
  "/about/our-story/ken-morgan-kuc-founder/": ["Ken Morgan, Our Founder", "The story of Ken Morgan, the businessman and philanthropist who founded Kids Under Cover in 1989 to help young people at risk of homelessness."],
  "/about/our-supporters/": ["Our Supporters and Partners", "Meet the patrons, ambassadors, corporate partners and program partners who help Kids Under Cover prevent youth homelessness."],
  "/about/our-team/": ["Our Team and Board", "Meet the Kids Under Cover executive leadership team and board of directors working to prevent youth homelessness."],
  "/additional-resources-for-educational-support/": ["Educational Support for Young People", "Scholarships, government programs and other support that can help young people stay in school, training and further study."],
  "/get-involved/": ["Ways to Give | Support Homeless Youth", "Donate, give monthly, donate your car, leave a gift in your will, fundraise or partner with Kids Under Cover to help young people stay close to home."],
  "/get-involved/bequests/": ["Leave a Gift in Your Will", "Make your Promise For Kids. Leave a gift in your will to Kids Under Cover and help young people at risk of homelessness for years to come. Free will writing."],
  "/get-involved/community-fundraising/": ["Fundraise for Youth Homelessness", "Join us in ending youth homelessness. Fundraise for Kids Under Cover in your community, and get our fundraising toolkit to help you get started."],
  "/get-involved/corporate-business-partnerships/": ["Corporate Partnerships", "Partner with Kids Under Cover through giving, workplace giving, sponsorship or in-kind support, and help prevent youth homelessness."],
  "/get-involved/donate-your-car-drop-off-locations/": ["Car Donation Drop Off Locations", "Drop your donated car at a Manheim auction site near you and receive a $100 eGift Card. Addresses and opening hours for every drop off location."],
  "/get-involved/donate-your-car/": ["Donate Your Car to Charity", "Donate your car, running or not, to Kids Under Cover. 100% tax deductible, with collection arranged in 9 cities. Over $23 million raised for young people."],
  "/get-involved/donate-your-car/how-it-works/": ["How Donating Your Car Works", "What vehicles we accept, how collection and drop off work, your tax receipt, and where the money goes when you donate your car to Kids Under Cover."],
  "/get-involved/donate-your-car/start/": ["Start Your Car Donation", "Donate your car to Kids Under Cover. 100% tax deductible, collection arranged, running or not. Tell us about your car and we'll do the rest."],
  "/get-involved/donate-your-car/their-new-beginning/": ["Your Car. Their New Beginning.", "Your old car can help a young person at risk of homelessness stay connected to education, family and community. See how a donated car becomes a home."],
  "/get-involved/donate/": ["Donate | Tax Deductible Donation", "Make a tax deductible donation to Kids Under Cover. Give once or monthly to build studios and fund scholarships for young people at risk of homelessness."],
  "/get-involved/work-with-us/": ["Work With Us | Careers", "Current jobs at Kids Under Cover, and what it's like to work with a team preventing youth homelessness."],
  "/jade_story/": ["Jade's Story", "Read Jade's story, in her own words, shared with Kids Under Cover."],
  "/learn-more-about-us/": ["Learn More About Us", "Kids Under Cover builds foundations to prevent youth homelessness, with studios, scholarships and supported housing for young people."],
  "/mobile-pod-pilot/": ["Mobile Pod Pilot Program", "The Kids Under Cover Mobile Pod pilot: housing that can be deployed quickly to ease family tension and prevent homelessness or entry into care."],
  "/mobile-pod-welcome-pack/": ["Mobile Pod Welcome Pack", "Welcome information for families with a Kids Under Cover mobile pod: care tips, maintenance, repairs and who to contact."],
  "/our-impact/": ["Our Impact", "How Kids Under Cover's studios, scholarships and supported housing change the lives of young people at risk of homelessness, and the research behind it."],
  "/our-impact/publications/": ["Annual Reports and Publications", "Kids Under Cover's annual reports, impact statements, strategic plan, Reconciliation Action Plan, research papers and Undercover News, in one place."],
  "/our-impact/research-and-resources/": ["Youth Homelessness Research", "Research on youth homelessness, overcrowding, youth justice and the impact of Kids Under Cover studios, with reports to read online and download."],
  "/our-impact/research-and-resources/a-new-place-to-call-home-research-paper/": ["A New Place to Call Home | Research", "A long-term study of the impact of Kids Under Cover studios on young people and their families, led by Dr Paul Stolz of Swinburne University."],
  "/our-impact/research-and-resources/annual-carer-feedback-survey-2/": ["Annual Carer Feedback Survey", "What carers tell us about life with a Kids Under Cover studio: findings from our Studio Program impact survey of families and carers."],
  "/our-impact/research-and-resources/crowding-risk-and-homelessness-2/": ["Crowding, Risk and Homelessness Study", "How overcrowding at home puts young people at risk of homelessness: a study of socio-spatial relations by Dr Paul Stolz at Swinburne University."],
  "/our-impact/research-and-resources/giving-them-a-chance/": ["Giving Them a Chance | Youth Justice Report", "New research from Kids Under Cover and Swinburne University finds stable, supported housing can reduce youth justice involvement. Read and download."],
  "/our-impact/research-and-resources/social-return-on-investment-report-2/": ["Social Return on Investment Report", "Ernst & Young's Social Return on Investment report on Kids Under Cover's Studio Program and the value it creates for young people and the community."],
  "/our-impact/the-facts-and-statistics-on-youth-homelessness/": ["Youth Homelessness Australia: Stats and Facts", "Key facts and statistics on youth homelessness in Australia: how many young people are homeless, why, and who is most at risk. Sources from ABS and AIHW."],
  "/our-impact/where-are-they-now/": ["Where Are They Now? Young People's Stories", "Catch up with young people who lived in Kids Under Cover studios and hear where life has taken them since."],
  "/our-programs/": ["Our Programs | Youth Housing and Education", "Kids Under Cover's programs: backyard studios, Village 21 supported housing, scholarships and support for young people at risk of homelessness."],
  "/our-programs/moorumbina-mongurnallin/": ["Moorumbina Mongurnallin Youth Housing", "Moorumbina Mongurnallin is supported independent living for First Nations young people leaving care, developed with VACCA, Anglicare Victoria and DFFH."],
  "/our-programs/resources-for-carers/": ["Kinship and Foster Carer Support", "Support services and resources for foster, kinship and family carers of young people, including urgent help and financial support."],
  "/our-programs/resources-for-young-people/": ["Support and Resources for Young People", "Help for young people facing homelessness or tough times at home: housing, mental health, legal, education and crisis support services."],
  "/our-programs/scholarships/": ["Youth Scholarships Program", "Kids Under Cover scholarships help young people at risk of homelessness stay in school, training and further study by covering education costs."],
  "/our-programs/scholarships/apply-for-a-scholarship/": ["Apply for a Scholarship", "Who can apply for a Kids Under Cover scholarship, what it can be used for, and how to apply, with answers to common questions."],
  "/our-programs/scholarships/apply-for-a-scholarship/scholarship-program-spending-guide/": ["Scholarship Spending Guide", "What you can and can't spend your Kids Under Cover scholarship on, and how to keep and upload your receipts."],
  "/our-programs/scholarships/dffh-student-scholarship-program/": ["DFFH Student Scholarship Program", "The DFFH Student Scholarship Program helps at-risk young people continue their education to Years 11 and 12 or TAFE. Eligibility, key dates and how to apply."],
  "/our-programs/scholarships/ken-lenka-morgan-scholarship/": ["Ken and Lenka Morgan Scholarship", "The Ken and Lenka Morgan Scholarship gives up to $5,000 to help a young person pursue their personal, educational and career goals. How to apply."],
  "/our-programs/scholarships/sarah-davies-empowering-women-scholarship/": ["Sarah Davies Empowering Women Scholarship", "The Sarah Davies Empowering Women Scholarship from Kids Under Cover: who can apply, what it covers and how to apply."],
  "/our-programs/studio-program/": ["Studio Program | Backyard Studios for Youth", "Kids Under Cover builds one and two bedroom backyard studios, with a bathroom, so young people at risk of homelessness can stay close to family."],
  "/our-programs/studio-program/kids-under-cover-studio-program-applications/": ["How to Apply for a Studio", "Studios are applied for by a support worker or community service organisation. Who is eligible, what it costs and how to submit an expression of interest."],
  "/our-programs/village21/": ["Village 21 | Supported Youth Housing", "Village 21 offers supported housing and live-in mentors for young people aged 18 to 21 leaving care, as they move to independent living."],
  "/our-programs/village21bairnsdale/": ["Village 21 Bairnsdale", "Village 21 Bairnsdale is supported housing for young people leaving care in East Gippsland, developed by Kids Under Cover with GEGAC."],
  "/our-programs/village21preston/": ["Village 21 Preston", "Village 21 Preston, our first Village 21, gives young people leaving care supported housing and live-in mentors, in partnership with Anglicare Victoria."],
  "/partner-donations/": ["Partner Donations", "Make a partner donation to Kids Under Cover and help build studios and fund scholarships for young people at risk of homelessness."],
  "/regular-donation/": ["Give Monthly | Regular Giving", "Become a regular giver. A monthly donation to Kids Under Cover gives young people at risk of homelessness stable, ongoing support. Tax deductible."],
  "/return-to-give/": ["Welcome Back", "Thank you for supporting Kids Under Cover. Renew your regular gift and keep helping young people at risk of homelessness stay close to home."],
  "/sign-up-for-our-newsletter/": ["Sign Up for Our Newsletter", "Get stories, news and ways to help young people at risk of homelessness from Kids Under Cover, straight to your inbox."],
  "/silent_auction/": ["Silent Auction Payment", "Pay for your Kids Under Cover silent auction item online."],
  "/smart-prezzee-egift-card-terms-and-conditions/": ["Smart Prezzee eGift Card Terms", "Terms and conditions for the $100 Smart Prezzee eGift Card thank you when you drop off your donated car at a designated auction site."],
  "/stories/": ["Stories of Young People, Carers and Donors", "Real stories from young people, families, carers and supporters of Kids Under Cover, and news from our studios, scholarships and Village 21."],
  "/target450/": ["Target450 | Housing 450 More Young People", "Target450 is our vision to prevent and end youth homelessness for an additional 450 young people every night through early intervention."],
};

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".md") ? [path.join(d, e.name)] : []));
const q = (s) => JSON.stringify(s);

if (process.argv[1].endsWith("seo-titles.mjs")) {
  let n = 0;
  for (const file of walk("content/pages")) {
    let raw = fs.readFileSync(file, "utf8");
    const url = matter(raw).data.url;
    const hit = seo[url];
    if (!hit) continue;
    const [t, d] = hit;
    raw = raw.replace(/^---\n([\s\S]*?)\n---/, (all, fm) => {
      let lines = fm.split("\n").filter((l) => !/^(seoTitle|description):/.test(l));
      const at = lines.findIndex((l) => /^title:/.test(l));
      lines.splice(at + 1 + (lines[at + 1]?.startsWith("titleAccent:") ? 1 : 0), 0, `seoTitle: ${q(t)}`, `description: ${q(d)}`);
      return "---\n" + lines.join("\n") + "\n---";
    });
    fs.writeFileSync(file, raw);
    n++;
  }
  console.log(`updated ${n} pages`);
  for (const [u, [t, d]] of Object.entries(seo)) {
    if (t.length > 45) console.log("long title", t.length, u);
    if (d.length > 160 || d.length < 70) console.log("description length", d.length, u);
  }
}
