// ===================================================
// Root Layout — Next.js App Router
// ===================================================

import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/lib/performance-monitor";
import { PWAInstallBanner, OfflineIndicator } from "@/lib/pwa";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

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
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#047857" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body 
        className="min-h-screen bg-background font-bengali antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Analytics />
          <PWAInstallBanner />
          <OfflineIndicator />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
