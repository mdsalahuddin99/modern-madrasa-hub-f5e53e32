"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Madrasa } from "@/data/madrasas";
import { cn } from "@/lib/utils";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ShareSection from "@/components/profile/ShareSection";

import dynamic from "next/dynamic";
import AboutTab from "@/components/profile/tabs/AboutTab";

const StudentsTeachersTab = dynamic(() => import("@/components/profile/tabs/StudentsTeachersTab"));
const AdmissionTab = dynamic(() => import("@/components/profile/tabs/AdmissionTab"));
const GalleryTab = dynamic(() => import("@/components/profile/tabs/GalleryTab"));
const ContactTab = dynamic(() => import("@/components/profile/tabs/ContactTab"));
const NoticeTab = dynamic(() => import("@/components/profile/tabs/NoticeTab"));

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

  const tabsList = [
    { id: "about", label: pc.sectionLabels?.intro || "পরিচিতি" },
    { id: "students", label: "শিক্ষক-শিক্ষার্থী" },
    { id: "admission", label: "ভর্তি তথ্য" },
    { id: "gallery", label: "গ্যালারি" },
    { id: "notices", label: "নোটিশ" },
    { id: "contact", label: "যোগাযোগ" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    tabsList.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tabsList]);

  const displayMadrasa = {
    ...madrasa,
    courses: Array.isArray(madrasa.courses) 
      ? madrasa.courses.map((c: any) => typeof c === 'string' ? c : c.name) 
      : [],
    facilities: Array.isArray(madrasa.facilities) 
      ? madrasa.facilities.map((f: any) => typeof f === 'string' ? f : f.name) 
      : [],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col selection:bg-primary/10 relative">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[30%] h-[30%] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 lg:pb-32 relative z-10 pt-20 lg:pt-28">
        <ProfileHero madrasa={displayMadrasa as any} onBack={() => router.back()} />

        {/* Floating Stats - Overlapping Hero */}
        <div className="container mx-auto px-5 -mt-12 md:-mt-16 lg:-mt-20 relative z-30 max-w-7xl">
          <ProfileStats madrasa={displayMadrasa as any} />
        </div>

        <div className="container mx-auto px-5 mt-10 lg:mt-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

            <div className="min-w-0">
              {/* Premium Glassmorphic Tab Bar */}
              <div className="sticky top-16 lg:top-20 z-40 bg-white/70 dark:bg-background/70 backdrop-blur-xl -mx-5 px-5 py-4 border-b border-white/50 dark:border-border/30 mb-8 shadow-sm transition-all">
                <div className="flex overflow-x-auto scrollbar-none gap-3 pb-2 px-1 items-center">
                  {tabsList.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          const element = document.getElementById(tab.id);
                          if (element) {
                            const y = element.getBoundingClientRect().top + window.scrollY - 130;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                        className={cn(
                          "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active-scale border",
                          isActive
                            ? "bg-gradient-to-r from-primary to-primary/90 text-white border-transparent shadow-lg shadow-primary/30 transform scale-105"
                            : "bg-white/80 dark:bg-card/80 text-muted-foreground border-border/20 hover:text-foreground hover:bg-white dark:hover:bg-card hover:shadow-md hover:border-primary/20 backdrop-blur-sm hover:-translate-y-0.5"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Sections (Stacked Vertically) */}
              <div className="flex flex-col gap-10 lg:gap-14 pb-12">
                <section id="about" className="scroll-mt-32">
                   <AboutTab madrasa={displayMadrasa as any} pc={pc} />
                </section>

                <section id="students" className="scroll-mt-32">
                   <StudentsTeachersTab madrasa={displayMadrasa as any} />
                </section>

                <section id="admission" className="scroll-mt-32">
                   <AdmissionTab pc={pc} madrasa={displayMadrasa} />
                </section>

                {displayMadrasa.galleryImages && displayMadrasa.galleryImages.length > 0 && (
                  <section id="gallery" className="scroll-mt-32">
                     <GalleryTab images={displayMadrasa.galleryImages.map(img => ({ src: img.url, alt: img.caption || displayMadrasa.name }))} label="গ্যালারি" />
                  </section>
                )}

                <section id="notices" className="scroll-mt-32">
                   <NoticeTab contents={displayMadrasa.contents} />
                </section>
                
                <section id="contact" className="scroll-mt-32">
                   <ContactTab madrasa={displayMadrasa as any} />
                </section>
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
