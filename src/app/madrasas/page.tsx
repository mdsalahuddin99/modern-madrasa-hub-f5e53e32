import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
        <div className="absolute inset-0 islamic-pattern opacity-[0.03] z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            {pageContent.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
            {pageContent.subtitle}
          </p>
        </div>
      </section>

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
