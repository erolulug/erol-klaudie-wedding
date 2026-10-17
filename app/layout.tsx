import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { withBasePath } from '@/lib/utils';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erol 💙 Klaudie – Svatební pozvánka | 14. 8. 2027",
  description: "Přijďte s námi oslavit náš velký den plný lásky ve Vendryni. Interaktivní svatební pozvánka se všemi informacemi, které potřebujete.",
  keywords: ["wedding", "invitation", "Erol", "Klaudie", "Czechia", "Vendryně", "August 2027"],
  authors: [{ name: "Erol & Klaudie" }],
  metadataBase: new URL('https://erolulug.github.io'),
  openGraph: {
    title: "Erol 💙 Klaudie – Svatební pozvánka",
    description: "Srdečně vás zveme na naši svatbu 14. srpna 2027 ve Vendryni.",
    type: "website",
    locale: "cs_CZ",
    alternateLocale: ["tr_TR", "en_US"],
    images: [
      {
        url: withBasePath("/images/IMG_3746.jpg"),
        width: 1200,
        height: 630,
        alt: "Svatební pozvánka – Erol & Klaudie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erol 💙 Klaudie – Svatební pozvánka",
    description: "Oslavte s námi náš velký den – 14. srpna 2027",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#eab0bf',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href={withBasePath("/images/IMG_3760.jpg")} />
        <link rel="preload" as="image" href={withBasePath("/images/IMG_3746.jpg")} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
