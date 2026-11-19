import type { Metadata } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BMCWidget } from "@/components/BMCWidget";
import { Toaster } from "sonner";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { AUTHOR, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const DESCRIPTION =
  "Build your GitHub profile README in minutes: auto-fill from your username, add badges, stats cards and sections, drag them into order, then copy the Markdown. Free, no sign-up.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ultimate README Gen: free GitHub profile README generator",
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  category: "technology",
  keywords: [
    "github profile readme generator",
    "github profile readme",
    "readme.md generator",
    "markdown generator",
    "github stats cards",
    "shields.io badges",
    "github profile design",
    "developer portfolio",
  ],
  authors: [{ name: AUTHOR.handle, url: AUTHOR.github }],
  creator: AUTHOR.handle,
  publisher: AUTHOR.handle,
  // The Open Graph / Twitter image comes from app/opengraph-image.tsx.
  openGraph: {
    title: "Your GitHub profile is a Markdown file. Ultimate README Gen writes it.",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your GitHub profile is a Markdown file. Ultimate README Gen writes it.",
    description: DESCRIPTION,
    creator: "@DSeonay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "W21oSCqITEuKtPO3qZtHDww6DZE5TtoHG40ac4A_aJo",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": SITE_NAME,
    "alternateName": "Ultimate GitHub Profile README Generator",
    "url": SITE_URL,
    "image": `${SITE_URL}/opengraph-image`,
    "description": DESCRIPTION,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "inLanguage": ["en", "fr"],
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Auto-fill from a GitHub username",
      "Drag-and-drop section order",
      "13 ready-made sections and free Markdown or HTML sections",
      "Custom shields.io badges in five styles",
      "GitHub stats, streak, top languages, trophies and STAT-STATS cards",
      "Live preview and raw Markdown, copy or download README.md",
      "JSON export and import of the whole setup"
    ],
    "author": {
      "@type": "Person",
      "name": AUTHOR.handle,
      "url": AUTHOR.github
    },
    "sameAs": [REPO_URL]
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeWrapper>
          {children}
          <BMCWidget />
          <Toaster richColors closeButton position="bottom-right" />
        </ThemeWrapper>
      </body>
    </html>
  );
}
