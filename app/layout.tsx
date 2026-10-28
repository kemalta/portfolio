import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const display = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const description =
  "Yapay zekâ, siber güvenlik, network ve server altyapıları ile web teknolojilerini bir araya getiren ICT portfolyosu. Kemal Talha Ekici.";

// GitHub Pages project sites live under /<repo>. metadataBase stays at the
// origin so Next can append basePath itself; canonical is spelled out.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteOrigin = new URL(siteConfig.siteUrl).origin;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Kemal Talha Ekici — ICT Systems, Cybersecurity & AI",
    template: "%s · Kemal Talha Ekici",
  },
  description,
  applicationName: "Kemal Talha Ekici — Portfolio",
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  keywords: [
    "Kemal Talha Ekici",
    "ICT",
    "siber güvenlik",
    "yapay zekâ",
    "network mühendisliği",
    "server altyapısı",
    "web geliştirme",
    "cybersecurity",
    "artificial intelligence",
  ],
  alternates: { canonical: basePath ? `${basePath}/` : "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: basePath ? `${basePath}/` : "/",
    siteName: siteConfig.name,
    title: "Kemal Talha Ekici — ICT Systems, Cybersecurity & AI",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kemal Talha Ekici — ICT Systems, Cybersecurity & AI",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Let the page reach the notch/home-indicator area; components pad themselves
  // back with env(safe-area-inset-*). Zoom is never disabled — the inputs are
  // 16px on touch instead.
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  jobTitle: "ICT Systems · Cybersecurity · Artificial Intelligence",
  description,
  url: siteConfig.siteUrl,
  ...(siteConfig.email ? { email: `mailto:${siteConfig.email}` } : {}),
  ...(siteConfig.links.length > 0
    ? { sameAs: siteConfig.links.map((link) => link.href) }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="relative min-h-screen bg-void font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-cyan focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-ink"
        >
          İçeriğe geç
        </a>
        <SmoothScrollProvider>
          <SiteChrome>{children}</SiteChrome>
        </SmoothScrollProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
