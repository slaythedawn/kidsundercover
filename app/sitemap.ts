import type { MetadataRoute } from "next";
import { allEntries } from "@/lib/content";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = allEntries()
    .filter((e) => e.kind !== "page" || (e.status === "live" && !e.noindex))
    .map((e) => ({
      url: site.url + e.url,
      lastModified: e.kind === "story" && e.date ? new Date(e.date) : undefined,
      priority: e.kind === "page" ? (e.section === "give" ? 0.9 : 0.7) : 0.5,
    }));
  return [{ url: site.url + "/", priority: 1 }, ...urls];
}
