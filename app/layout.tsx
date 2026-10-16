import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileDonateBar from "@/components/MobileDonateBar";
import { JsonLd, organisation, website } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kuc.org.au"),
  title: { default: "Kids Under Cover | Youth Homelessness Charity Australia", template: "%s | Kids Under Cover" },
  description:
    "Kids Under Cover is an Australian charity stopping youth homelessness before it starts, with backyard studios and scholarships that keep young people close to family and school.",
  openGraph: { siteName: "Kids Under Cover", locale: "en_AU", type: "website", images: ["/images/mast.jpg"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@600;700;800&family=Figtree:wght@400;500;600;700&family=Fraunces:ital,wght@1,600&display=swap"
        />
      </head>
      <body>
        <JsonLd data={[organisation(), website()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileDonateBar />
      </body>
    </html>
  );
}
