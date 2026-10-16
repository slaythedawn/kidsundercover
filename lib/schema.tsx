/**
 * Structured data (schema.org JSON-LD) that tells search engines and AI
 * assistants who Kids Under Cover is. The organisation record sits on every
 * page (app/layout.tsx); pages add their own records on top (articles, FAQs,
 * breadcrumbs, people, reports, services).
 */
import { external, site } from "@/content/site";

const ORG_ID = `${site.url}/#organisation`;

export function organisation() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": ORG_ID,
    name: site.name,
    alternateName: "KUC",
    url: site.url,
    logo: `${site.url}${site.logo}`,
    description: "Kids Under Cover is an Australian charity that prevents youth homelessness by building studios for young people in the backyards of family and carers' homes, and funding scholarships that keep them in education.",
    foundingDate: "1989",
    founder: { "@type": "Person", name: "Ken Morgan" },
    taxID: site.abn,
    telephone: "+61 1800 801 633",
    areaServed: { "@type": "Country", name: "Australia" },
    sameAs: [external.facebook, external.instagram, external.linkedin, external.youtube],
    potentialAction: { "@type": "DonateAction", target: external.donate, recipient: { "@id": ORG_ID } },
  };
}

export function website() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, publisher: { "@id": ORG_ID } };
}

export const orgRef = { "@id": ORG_ID };

export function person(p: { name: string; role?: string; url: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role,
    image: p.image,
    url: `${site.url}${p.url}`,
    worksFor: orgRef,
  };
}

export function report(p: { title: string; description?: string; url: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: p.title,
    description: p.description,
    url: `${site.url}${p.url}`,
    image: p.image,
    publisher: orgRef,
  };
}

export function service(p: { name: string; description?: string; url: string; areas: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.name,
    description: p.description,
    url: `${site.url}${p.url}`,
    provider: orgRef,
    areaServed: p.areas.map((name) => ({ "@type": "City", name })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
