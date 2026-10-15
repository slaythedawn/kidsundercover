import s from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={s.crumbs}>
      <ol>
        {all.map((c, i) => (
          <li key={c.href}>
            {i < all.length - 1 ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `https://www.kuc.org.au${c.href}` })),
          }),
        }}
      />
    </nav>
  );
}
