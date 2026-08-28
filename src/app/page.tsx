import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InteractiveMap from "@/components/InteractiveMap";
import StatsBar from "@/components/StatsBar";
import SearchSection from "@/components/SearchSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorks from "@/components/HowItWorks";
import BoardsSection from "@/components/BoardsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FeaturedMadrasas from "@/components/FeaturedMadrasas";
import { getCachedHomeStats } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/ScrollToTop";

import { warmMadrasaCache } from "@/lib/cache";

export const metadata: Metadata = {
  title: "কওমি মাদ্রাসা ডিরেক্টরি - বাংলাদেশের সকল মাদ্রাসার সম্পূর্ণ তালিকা",
  description:
    "বাংলাদেশের সকল কওমি মাদ্রাসার সম্পূর্ণ তালিকা। বিভাগ, জেলা, থানা অনুযায়ী খুঁজুন। মাদ্রাসার বিস্তারিত তথ্য, ভর্তি তথ্য, কোর্স এবং সুবিধাদি জানুন।",
  keywords: [
    "কওমি মাদ্রাসা",
    "মাদ্রাসা ডিরেক্টরি",
    "বাংলাদেশ মাদ্রাসা",
    "ইসলামিক শিক্ষা",
    "মাদ্রাসা ভর্তি",
    "কওমি শিক্ষা বোর্ড",
  ],
  authors: [{ name: "কওমি মাদ্রাসা ডিরেক্টরি টিম" }],
  openGraph: {
    title: "কওমি মাদ্রাসা ডিরেক্টরি - বাংলাদেশের সকল মাদ্রাসার সম্পূর্ণ তালিকা",
    description: "বাংলাদেশের সকল কওমি মাদ্রাসার সম্পূর্ণ তালিকা। বিভাগ, জেলা, থানা অনুযায়ী খুঁজুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "কওমি মাদ্রাসা ডিরেক্টরি",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "কওমি মাদ্রাসা ডিরেক্টরি" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "কওমি মাদ্রাসা ডিরেক্টরি - বাংলাদেশের সকল মাদ্রাসার সম্পূর্ণ তালিকা",
    description: "বাংলাদেশের সকল কওমি মাদ্রাসার সম্পূর্ণ তালিকা। বিভাগ, জেলা, থানা অনুযায়ী খুঁজুন।",
    images: ["/twitter-image.png"],
  },
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
  alternates: { canonical: "https://madrasah-directory.com" },
};

if (process.env.NODE_ENV === "production") {
  warmMadrasaCache().catch(console.error);
}

async function StatsSection() {
  const stats = await getCachedHomeStats();
  return <StatsBar stats={stats} />;
}

async function FeaturedSection() {
  const madrasas = await prisma.madrasa.findMany({
    where: { featured: true, status: "APPROVED" },
    include: { district: true, division: true },
    take: 6,
  });

  const formatted = madrasas.map(m => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    division: m.division.nameBn,
    district: m.district.nameBn,
    thana: "",
    category: m.category,
    board: m.board,
    established: m.established || "",
    students: m.students,
    teachers: m.teachers,
    description: m.description || "",
    address: m.address,
    phone: m.phone,
    email: m.email,
    rating: m.rating,
    featured: m.featured,
    courses: [],
    facilities: [],
    image: m.image || "",
  }));

  return <FeaturedMadrasas featuredMadrasas={formatted as any} />;
}

async function BoardsData() {
  const boards = await prisma.educationBoard.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, abbr: true, logoUrl: true, website: true },
  });
  return <BoardsSection boards={boards} />;
}

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="min-h-screen bg-background overflow-x-hidden pb-20 lg:pb-0">
        <Navbar />
        <HeroSection />
        <InteractiveMap />

        <Suspense
          fallback={
            <div className="h-48 flex items-center justify-center container mx-auto px-4">
              <Skeleton className="h-44 w-full rounded-3xl" />
            </div>
          }
        >
          <StatsSection />
        </Suspense>

        <SearchSection />
        
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Skeleton className="h-80 w-full container mx-auto rounded-3xl" /></div>}>
          <FeaturedSection />
        </Suspense>

        <CTASection />
        <CategoriesSection />
        <HowItWorks />

        <Suspense fallback={<div className="h-40 flex items-center justify-center container mx-auto px-4"><Skeleton className="h-36 w-full rounded-3xl" /></div>}>
          <BoardsData />
        </Suspense>
        <Footer />
        <ScrollToTop />
      </main>
    </>
  );
}
