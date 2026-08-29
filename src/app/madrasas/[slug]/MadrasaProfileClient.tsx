"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Madrasa } from "@/data/madrasas";
import { cn } from "@/lib/utils";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ShareSection from "@/components/profile/ShareSection";

import AboutTab from "@/components/profile/tabs/AboutTab";
import StudentsTeachersTab from "@/components/profile/tabs/StudentsTeachersTab";
import AdmissionTab from "@/components/profile/tabs/AdmissionTab";
import GalleryTab from "@/components/profile/tabs/GalleryTab";
import ContactTab from "@/components/profile/tabs/ContactTab";
import NoticeTab from "@/components/profile/tabs/NoticeTab";

interface ExtendedMadrasa extends Omit<Madrasa, "galleryImages"> {
  galleryImages?: { id: string; url: string; caption?: string | null }[];
  history?: string | null;
  mission?: string | null;
  vision?: string | null;
  alumniCount?: string | null;
  notableAlumni?: string | null;
  admissionFile?: string | null;
  admissionFileType?: string | null;
  contents?: any[];
}

interface MadrasaProfileClientProps {
  madrasa: ExtendedMadrasa;
}

export default function MadrasaProfileClient({ madrasa }: MadrasaProfileClientProps) {
  const router = useRouter();
  const { content } = useSiteContent();
  const pc = content.profile;
  const [activeTab, setActiveTab] = useState("about");

  const displayMadrasa = {
    ...madrasa,
    courses: Array.isArray(madrasa.courses) 
      ? madrasa.courses.map((c: any) => typeof c === 'string' ? c : c.name) 
      : [],
    facilities: Array.isArray(madrasa.facilities) 
      ? madrasa.facilities.map((f: any) => typeof f === 'string' ? f : f.name) 
      : [],
  };

  const tabsList = [
    { id: "about", label: pc.sectionLabels?.intro || "পরিচিতি" },
    { id: "students", label: "শিক্ষক-শিক্ষার্থী" },
    { id: "admission", label: "ভর্তি তথ্য" },
    { id: "gallery", label: "গ্যালারি" },
    { id: "notices", label: "নোটিশ" },
    { id: "contact", label: "যোগাযোগ" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1 pb-24 lg:pb-32">
        <ProfileHero madrasa={displayMadrasa as any} onBack={() => router.back()} />

        {/* Floating Stats - Overlapping Hero */}
        <div className="container mx-auto px-5 -mt-12 md:-mt-16 lg:-mt-20 relative z-30 max-w-7xl">
          <ProfileStats madrasa={displayMadrasa as any} />
        </div>

        <div className="container mx-auto px-5 mt-10 lg:mt-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

            <div className="min-w-0">
              {/* Native App Style Tab Bar - Desktop Optimized */}
              <div className="sticky top-16 lg:top-20 z-40 bg-background/80 backdrop-blur-md -mx-5 px-5 py-4 border-b border-border/40 mb-8 overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-none gap-2">
                  {tabsList.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] lg:text-xs font-black uppercase tracking-widest transition-all active-scale",
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content with Native Animation */}
              <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-card rounded-[2.5rem] lg:rounded-[3.5rem] p-6 sm:p-10 lg:p-12 border border-border/40 shadow-soft relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                      <div className="relative z-10">
                        {activeTab === "about" && <AboutTab madrasa={displayMadrasa as any} pc={pc} />}
                        {activeTab === "students" && <StudentsTeachersTab madrasa={displayMadrasa as any} />}
                        {activeTab === "admission" && <AdmissionTab pc={pc} admissionFile={displayMadrasa.admissionFile || undefined} admissionFileType={displayMadrasa.admissionFileType || undefined} />}
                        {activeTab === "notices" && <NoticeTab contents={displayMadrasa.contents} />}
                        {activeTab === "gallery" && <GalleryTab images={displayMadrasa.galleryImages?.map(img => ({ src: img.url, alt: img.caption || displayMadrasa.name })) || []} label="গ্যালারি" />}
                        {activeTab === "contact" && <ContactTab madrasa={displayMadrasa as any} />}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-12 lg:mt-16">
                 <ShareSection madrasaId={displayMadrasa.id} madrasaName={displayMadrasa.name} />
              </div>
            </div>

            {/* Sidebar remains visible on large screens */}
            <div className="hidden lg:block sticky top-32">
              <ProfileSidebar madrasa={displayMadrasa as any} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
