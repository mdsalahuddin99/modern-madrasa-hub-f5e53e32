// ===================================================
// Root Layout — Next.js App Router
// ===================================================

import type { Metadata } from "next";
import { Noto_Sans_Bengali, Hind_Siliguri } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/lib/performance-monitor";
import { OfflineIndicator } from "@/lib/pwa";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import MobileBottomNav from "@/components/navbar/MobileBottomNav";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "কওমি মাদ্রাসা ডিরেক্টরি — বাংলাদেশের সবচেয়ে বড় মাদ্রাসা তালিকা",
  description:
    "বাংলাদেশের সকল কওমি মাদ্রাসার তথ্য, ভর্তি নিয়মাবলী, যোগাযোগ এবং আরও অনেক কিছু এক জায়গায়।",
  keywords: ["কওমি মাদ্রাসা", "মাদ্রাসা ডিরেক্টরি", "বাংলাদেশ", "ইসলামী শিক্ষা"],
  openGraph: {
    title: "কওমি মাদ্রাসা ডিরেক্টরি",
    description: "বাংলাদেশের সবচেয়ে বড় মাদ্রাসা তালিকা",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${notoSansBengali.variable} ${hindSiliguri.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a6631" />
        <link rel="apple-touch-icon" href="/pwa-icon-192.png" />
      </head>
      <body 
        className="min-h-screen bg-background font-bengali antialiased max-md:pb-16"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Analytics />
          <MobileBottomNav />
          <OfflineIndicator />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
