import type { NextConfig } from "next";
import { pageRedirects } from "./lib/content";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  async redirects() {
    return [
      // Pages merged or retired in the rebuild (set in each page's front matter).
      ...pageRedirects().map((r) => ({ ...r, permanent: true })),
      // Old WordPress archives now live on the stories page.
      { source: "/category/:path*", destination: "/stories/", permanent: true },
      { source: "/tag/:path*", destination: "/stories/", permanent: true },
      { source: "/author/:path*", destination: "/stories/", permanent: true },
    ];
  },
};

export default nextConfig;
