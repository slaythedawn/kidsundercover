import s from "./Prose.module.css";

/** Migrated page copy, styled to match the site. */
export default function Prose({ html, className }: { html: string; className?: string }) {
  return <div className={`${s.prose} ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
