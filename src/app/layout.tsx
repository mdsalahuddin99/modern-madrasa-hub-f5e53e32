// ===================================================
// Root Layout — Next.js App Router
// ===================================================

import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, Hind_Siliguri } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/lib/performance-monitor";
import { OfflineIndicator } from "@/lib/pwa";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MobileBottomNav from "@/components/navbar/MobileBottomNav";
import "./globals.css";

const kalpurush = localFont({
  src: "../../public/kalpurush.ttf",
  variable: "--font-kalpurush",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#155828",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://madrasahportal.vercel.app'),
  title: "কওমি মাদ্রাসা ডিরেক্টরি — বাংলাদেশের সবচেয়ে বড় মাদ্রাসা তালিকা",
  description:
    "বাংলাদেশের সকল কওমি মাদ্রাসার তথ্য, ভর্তি নিয়মাবলী, যোগাযোগ এবং আরও অনেক কিছু এক জায়গায়।",
  keywords: ["কওমি মাদ্রাসা", "মাদ্রাসা ডিরেক্টরি", "বাংলাদেশ", "ইসলামী শিক্ষা", "কওমি শিক্ষা বোর্ড", "মাদ্রাসা ভর্তি", "Qawmi Madrasa", "Bangladesh Madrasa"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Madrasah Portal",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://madrasahportal.vercel.app",
    siteName: "কওমি মাদ্রাসা ডিরেক্টরি",
    title: "কওমি মাদ্রাসা ডিরেক্টরি — বাংলাদেশের সবচেয়ে বড় মাদ্রাসা তালিকা",
    description: "বাংলাদেশের সকল কওমি মাদ্রাসার তথ্য, ভর্তি নিয়মাবলী, যোগাযোগ এবং আরও অনেক কিছু এক জায়গায়।",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "কওমি মাদ্রাসা ডিরেক্টরি",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "কওমি মাদ্রাসা ডিরেক্টরি",
    description: "বাংলাদেশের সকল কওমি মাদ্রাসার তথ্য ও ডিরেক্টরি",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${kalpurush.variable} ${notoSansBengali.variable} ${hindSiliguri.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
      </head>
      <body 
        className="min-h-screen bg-background font-bengali antialiased max-md:pb-16 selection:bg-primary/20"
        suppressHydrationWarning
      >
        <Providers>
          <div suppressHydrationWarning className="flex flex-col min-h-screen">
            {children}
          </div>
          <Analytics />
          <MobileBottomNav />
          <OfflineIndicator />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
