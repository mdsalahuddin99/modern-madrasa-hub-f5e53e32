"use client";

import { usePathname } from "next/navigation";
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileHeaderWrapper({ madrasa }: { madrasa: any }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  
  const isRootProfilePage = pathname === `/${madrasa.slug}`;

  if (isRootProfilePage) {
    return (
      <>
        <ProfileHero madrasa={madrasa} />
        {/* Floating Stats - Overlapping Hero */}
        <div className="container mx-auto px-5 -mt-12 md:-mt-16 lg:-mt-20 relative z-30 max-w-7xl">
          <ProfileStats madrasa={madrasa} />
        </div>
      </>
    );
  }

  const getPageTitle = () => {
    if (pathname.includes('/academic')) return 'শিক্ষা কার্যক্রম';
    if (pathname.includes('/admission')) return 'ভর্তি তথ্য';
    if (pathname.includes('/gallery')) return 'গ্যালারি';
    if (pathname.includes('/notices')) return 'নোটিশ';
    if (pathname.includes('/contact')) return 'যোগাযোগ';
    if (pathname.includes('/teachers')) return 'শিক্ষকগণ';
    if (pathname.includes('/students')) return 'শিক্ষার্থী';
    return madrasa.name;
  };

  return (
    <>
      <section className="relative h-[25vh] min-h-[220px] w-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden">
        {/* Dynamic Gradient Overlay for Premium Look */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-900/10 to-transparent" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay pointer-events-none" />

        {/* Top Header Actions */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between safe-top">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="container mx-auto px-5 relative z-20 text-center mt-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">
            {getPageTitle()}
          </h1>
          <p className="text-white/90 mt-2 text-sm md:text-base font-medium">
            {madrasa.name}
          </p>
        </div>

        {/* Subtle Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] islamic-pattern pointer-events-none mix-blend-overlay" />
      </section>
      
      {/* We add a small margin below the hero since there are no overlapping stats */}
      <div className="h-6 md:h-10"></div>
    </>
  );
}
