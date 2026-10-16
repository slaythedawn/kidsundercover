import type { NextConfig } from "next";
import { pageRedirects } from "./lib/content";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  async redirects() {
    return [
      // Pages merged or retired in the rebuild (set in each page's front matter).
      ...pageRedirects().map((r) => ({ ...r, permanent: true })),
      // Old addresses still linked from emails and other sites.
      { source: "/kuc_bequests-2025/", destination: "/get-involved/bequests/", permanent: true },
      { source: "/our-programs/village-program/", destination: "/our-programs/village21/", permanent: true },
      // Old WordPress listing pages, date archives and the /news/ prefix (GA4 shows people still land on these).
      { source: "/stories/page/:n/", destination: "/stories/", permanent: true },
      { source: "/page/:n/", destination: "/stories/", permanent: true },
      { source: "/media-release/page/:n/", destination: "/about/media-centre/", permanent: true },
      { source: "/about/media-centre/page/:n/", destination: "/about/media-centre/", permanent: true },
      { source: "/:year(\\d{4})/:month(\\d{2})/", destination: "/stories/", permanent: true },
      { source: "/news/:year(\\d{4})/:month(\\d{2})/", destination: "/stories/", permanent: true },
      { source: "/news/:kind(tag|category|page)/:path*", destination: "/stories/", permanent: true },
      { source: "/type/:path*", destination: "/stories/", permanent: true },
      { source: "/news/:slug/", destination: "/:slug/", permanent: true },
      // Truncated addresses that rank in Google (Ahrefs, October 2026), sent to the pages their keywords belong to.
      { source: "/Our", destination: "/our-impact/the-facts-and-statistics-on-youth-homelessness/", permanent: true },
      { source: "/Get", destination: "/get-involved/donate-your-car/", permanent: true },
      { source: "/team-category/:path*", destination: "/about/our-team/", permanent: true },
      // Old WordPress archives now live on the stories page.
      { source: "/category/:path*", destination: "/stories/", permanent: true },
      { source: "/tag/:path*", destination: "/stories/", permanent: true },
      { source: "/author/:path*", destination: "/stories/", permanent: true },
    ];
  },
};

export default nextConfig;
