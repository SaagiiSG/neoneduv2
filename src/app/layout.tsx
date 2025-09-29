import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { clashDisplay, montserrat } from "@/lib/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neon Edu - Your Gateway to Global Education | Study Abroad & English Courses",
  description: "Neon Edu offers English language courses, IELTS preparation, and study abroad services in Mongolia. Study in Australia, Singapore, South Korea, Malaysia, China, and Hungary. Since 2015.",
  keywords: [
    "study abroad",
    "English courses Mongolia",
    "IELTS preparation Mongolia",
    "study Australia",
    "study Singapore",
    "study South Korea",
    "study Malaysia",
    "study China",
    "study Hungary",
    "education agency Mongolia",
    "Neon Edu",
    "global education",
    "university application",
    "visa application Mongolia"
  ],
  authors: [{ name: "Neon Edu" }],
  creator: "Neon Edu",
  publisher: "Neon Edu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neonedu.net",
    siteName: "Neon Edu",
    title: "Neon Edu - Your Gateway to Global Education",
    description: "Neon Edu offers English language courses, IELTS preparation, and study abroad services in Mongolia. Study in Australia, Singapore, South Korea, Malaysia, China, and Hungary.",
    images: [
      {
        url: "/Neon Edu v3.png",
        width: 1200,
        height: 630,
        alt: "Neon Edu - Your Gateway to Global Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neon Edu - Your Gateway to Global Education",
    description: "Neon Edu offers English language courses, IELTS preparation, and study abroad services in Mongolia.",
    images: ["/Neon Edu v3.png"],
  },
  alternates: {
    canonical: "https://neonedu.net",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/Neon Edu Logo.png" as="image" />
        <link rel="preload" href="/Neon Edu v3.png" as="image" />
        <link rel="preload" href="/australiaDots.svg" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preload custom fonts */}
        <link rel="preload" href="/_next/static/media/ClashDisplay-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/media/ClashDisplay-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/_next/static/media/ClashDisplay-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Additional SEO and Performance Optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF872F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Neon Edu" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Neon Edu Logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Neon Edu Logo.png" />
        <link rel="apple-touch-icon" href="/Neon Edu Logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
      </head>
      <body
        className={`${clashDisplay.variable} ${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
