import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getSiteContent } from "@/data/siteContent";
import MadrasaListClient from "@/components/MadrasaListClient";
import { MadrasaService } from "@/services/madrasa.service";
import MadrasaCardSkeleton from "@/components/MadrasaCardSkeleton";

export const metadata: Metadata = {
  title: "সব মাদ্রাসা - কওমি মাদ্রাসা ডিরেক্টরি",
  description: "বাংলাদেশের সকল কওমি মাদ্রাসার সম্পূর্ণ তালিকা। বিভাগ, জেলা, থানা অনুযায়ী খুঁজুন এবং বিস্তারিত তথ্য জানুন।",
};

async function MadrasaListSection() {
  let initialData;
  try {
    initialData = await MadrasaService.getAll({ page: 1, limit: 12 });
  } catch (error) {
    // Keep the page responsive even when database is temporarily unavailable.
    console.error("Failed to load initial madrasa list:", error);
    initialData = {
      madrasas: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    };
  }

  return <MadrasaListClient initialData={initialData} />;
}

export default function MadrasaListPage() {
  const content = getSiteContent();
  const pageContent = content.pages.madrasaList;
  
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      
      {/* Hero */}
      <PageHero
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "মাদ্রাসা তালিকা" }
        ]}
      />

      {/* Madrasa List with Client-side Search & Filters */}
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <MadrasaCardSkeleton key={i} />)}
          </div>
        </div>
      }>
        <MadrasaListSection />
      </Suspense>

      <Footer />
    </div>
  );
}
