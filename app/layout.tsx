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

export const metadata: Metadata = {
  title: "Ultimate GitHub Profile README Generator | Build Your Tech Identity",
  description: "Generate an amazing GitHub Profile README in seconds. Features: Smart Auto-fill, Drag & Drop layout, dynamic stats cards, and real-time preview.",
  keywords: [
    "GitHub", "README", "Profile", "Generator", "Markdown", "Developer Tools", 
    "PortFolio", "GitHub Stats", "Zustand", "Next.js", "Tailwind CSS"
  ],
  authors: [{ name: "D-Seonay", url: "https://github.com/D-Seonay" }],
  openGraph: {
    title: "Ultimate GitHub Profile README Generator",
    description: "The most powerful tool to design your GitHub profile. Auto-fill from your profile, reorder sections with drag & drop, and choose between beautiful themes.",
    url: "https://readme-profile-gen.vercel.app",
    siteName: "README Gen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate GitHub Profile README Generator",
    description: "Design an exceptional GitHub profile in seconds with our smart generator.",
    creator: "@DSeonay",
  },
  robots: {
    index: true,
    follow: true,
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950">
        {children}
        <BMCWidget />
      </body>
    </html>
  );
}
