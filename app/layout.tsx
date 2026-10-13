import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Under Cover | Stop youth homelessness before it starts",
  description:
    "Kids Under Cover builds studios and funds education that keep young people close to family, school and community, before crisis hits.",
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
      <body>{children}</body>
    </html>
  );
}
