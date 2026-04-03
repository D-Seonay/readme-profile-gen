import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BMCWidget } from "@/components/BMCWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://readme-profile-gen.matheodelaunay.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ultimate GitHub Profile README Generator | Free Tool",
    template: "%s | Ultimate README Gen"
  },
  description: "Create a stunning GitHub profile in seconds. Best free tool for developers to generate professional READMEs with stats, trophies, tech stack, and more.",
  keywords: [
    "github profile readme generator",
    "awesome readme generator",
    "github stats cards",
    "github trophies",
    "developer portfolio",
    "markdown generator",
    "github bio generator",
    "best github readme tool"
  ],
  alternates: {
    canonical: SITE_URL,
  },
  authors: [{ name: "D-Seonay", url: "https://github.com/D-Seonay" }],
  openGraph: {
    title: "Ultimate GitHub Profile README Generator",
    description: "The most powerful tool to design your GitHub profile. Auto-fill from your profile, reorder sections with drag & drop, and choose between beautiful themes.",
    url: SITE_URL,
    siteName: "Ultimate README Gen",
    images: [
      {
        url: "/og-image.png", // Idéalement, crée cette image dans /public
        width: 1200,
        height: 630,
        alt: "Ultimate GitHub Profile README Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate GitHub Profile README Generator",
    description: "Design an exceptional GitHub profile in seconds with our smart generator.",
    creator: "@DSeonay",
    images: ["/og-image.png"],
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
    "@type": "SoftwareApplication",
    "name": "Ultimate GitHub Profile README Generator",
    "description": "A powerful web tool to generate professional GitHub profile READMEs with dynamic stats and smart auto-fill.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "D-Seonay"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950">
        {children}
        <BMCWidget />
      </body>
    </html>
  );
}
