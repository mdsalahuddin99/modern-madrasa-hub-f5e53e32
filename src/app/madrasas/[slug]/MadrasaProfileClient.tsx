"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Madrasa } from "@/data/madrasas";

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

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

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

  // Normalize data for child components
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
    { id: "students", label: "শিক্ষক ও শিক্ষার্থী" },
    { id: "admission", label: pc.admissionTitle || "ভর্তি তথ্য" },
    { id: "notices", label: "নোটিশ ও সংবাদ" },
    { id: "gallery", label: pc.sectionLabels?.gallery || "গ্যালারি" },
    { id: "contact", label: "যোগাযোগ" },
  ];

  const prismaGalleryImages = displayMadrasa.galleryImages?.map(img => ({
    src: img.url,
    alt: img.caption || displayMadrasa.name
  })) || [];
  
  const galleryImagesToPass = prismaGalleryImages.length > 0 ? prismaGalleryImages : (pc.galleryImages || []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16 md:pb-24">
        <ProfileHero madrasa={displayMadrasa as any} onBack={() => router.back()} />

        <div className="container mx-auto px-4 -mt-6 md:-mt-8 relative z-20">
          <ProfileStats madrasa={displayMadrasa as any} />
        </div>

        <div className="container mx-auto px-4 mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:gap-8 items-start">
            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
                className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 md:mb-8 border-b border-border/40 pb-1"
              >
                {tabsList.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative group ${
                      activeTab === tab.id
                        ? "text-primary bg-primary/10 shadow-inner"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabProfile"
                        className="absolute inset-0 border-2 border-primary/20 rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    {activeTab === "about" && <AboutTab madrasa={displayMadrasa as any} pc={pc} />}
                    {activeTab === "students" && <StudentsTeachersTab madrasa={displayMadrasa as any} />}
                    {activeTab === "admission" && <AdmissionTab pc={pc} admissionFile={displayMadrasa.admissionFile || undefined} admissionFileType={displayMadrasa.admissionFileType || undefined} />}
                    {activeTab === "notices" && <NoticeTab contents={displayMadrasa.contents} />}
                    {activeTab === "gallery" && <GalleryTab images={galleryImagesToPass} label={pc.sectionLabels?.gallery || "গ্যালারি"} />}
                    {activeTab === "contact" && <ContactTab madrasa={displayMadrasa as any} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <ShareSection madrasaId={displayMadrasa.id} madrasaName={displayMadrasa.name} />
            </div>

            <div className="w-full">
              <ProfileSidebar madrasa={displayMadrasa as any} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
