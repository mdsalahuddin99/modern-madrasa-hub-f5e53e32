"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, GraduationCap, ChevronRight, ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, toBn } from "@/lib/utils";

const divisions = [
  { id: "dhaka", name: "ঢাকা", stats: { madrasas: 1250, students: "৪৫,০০০+" } },
  { id: "chittagong", name: "চট্টগ্রাম", stats: { madrasas: 850, students: "৩১,০০০+" } },
  { id: "rajshahi", name: "রাজশাহী", stats: { madrasas: 480, students: "১৭,২০০+" } },
  { id: "khulna", name: "খুলনা", stats: { madrasas: 390, students: "১৪,১০০+" } },
  { id: "mymensingh", name: "ময়মনসিংহ", stats: { madrasas: 420, students: "১৫,৫০০+" } },
  { id: "rangpur", name: "রংপুর", stats: { madrasas: 340, students: "১২,০০০+" } },
  { id: "sylhet", name: "সিলেট", stats: { madrasas: 280, students: "৯,৮০০+" } },
  { id: "barisal", name: "বরিশাল", stats: { madrasas: 310, students: "১০,৫০০+" } },
];

const InteractiveMap = () => {
  const [activeDiv, setActiveDiv] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const activeNode = divisions[activeDiv];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveDiv((prev) => (prev + 1) % divisions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle manual click
  const handleTabClick = (index: number) => {
    setActiveDiv(index);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  // Auto-scroll the horizontal/vertical list smoothly
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.children[activeDiv] as HTMLElement;
      
      if (activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elRect = activeElement.getBoundingClientRect();
        
        if (window.innerWidth >= 1024) {
          // Desktop: vertical center
          const scrollTop = container.scrollTop + (elRect.top - containerRect.top) - (containerRect.height / 2) + (elRect.height / 2);
          container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        } else {
          // Mobile: horizontal center
          const scrollLeft = container.scrollLeft + (elRect.left - containerRect.left) - (containerRect.width / 2) + (elRect.width / 2);
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
    }
  }, [activeDiv]);

  return (
    <section className="py-12 lg:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[12px] font-bold uppercase tracking-widest mb-6">
            <MapPin className="w-4 h-4" /> লোকেশন ভিত্তিক তথ্য
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tighter">
            দেশজুড়ে আমাদের <br />
            <span className="text-primary">মাদ্রাসা নেটওয়ার্ক</span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl font-medium">
            টেকনাফ থেকে তেঁতুলিয়া— দেশের প্রতিটি প্রান্তের কওমি মাদ্রাসার সঠিক তথ্য এখন এক ক্লিকেই আপনার হাতের মুঠোয়। নিচের তালিকা থেকে বিভাগ নির্বাচন করে তথ্য দেখুন।
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch min-w-0">
          
          <div className="lg:col-span-4 relative min-h-[70px] lg:min-h-0 min-w-0">
            <div 
              ref={scrollContainerRef}
              className="relative flex lg:absolute lg:inset-0 lg:flex-col gap-3 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto px-[25vw] lg:px-0 pb-6 lg:pb-0 snap-x lg:snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
            {divisions.map((div, i) => {
              const isActive = activeDiv === i;
              return (
                <button
                  key={div.id}
                  onClick={() => handleTabClick(i)}
                  className={cn(
                    "relative flex-shrink-0 snap-center flex items-center justify-between px-6 py-3 lg:py-4 rounded-full lg:rounded-2xl transition-all duration-300 font-bold text-sm lg:text-lg",
                    isActive 
                      ? "text-white lg:scale-[1.02]" 
                      : "bg-[#FAFAFA] text-foreground hover:bg-primary/5 lg:hover:scale-[1.01]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDivisionBg"
                      className="absolute inset-0 bg-primary rounded-full lg:rounded-2xl shadow-lg shadow-primary/20 z-0"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 lg:gap-3">
                    <span className={cn(
                      "w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-colors duration-300",
                      isActive ? "bg-white" : "bg-primary/30"
                    )} />
                    {div.name}
                  </span>
                  {isActive && <ChevronRight className="relative z-10 hidden lg:block w-5 h-5 text-white/80 ml-4" />}
                </button>
              );
            })}
          </div>
          </div>

          {/* Right Side: Active Division Details (Luxe Card) */}
          <div className="lg:col-span-8 relative min-h-[380px] flex flex-col justify-center min-w-0">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white shadow-2xl shadow-black/5 border border-black/5 rounded-3xl md:rounded-[2rem] p-6 md:p-12 w-full"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 md:gap-6">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-1 md:mb-2">
                      {activeNode.name} <span className="text-primary font-light">বিভাগ</span>
                    </h3>
                    <p className="text-xs md:text-base text-muted-foreground font-medium">এই বিভাগের মোট নিবন্ধিত প্রতিষ্ঠানের পরিসংখ্যান</p>
                  </div>
                  <Button className="w-full md:w-auto h-12 px-8 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-full uppercase text-xs tracking-wider transition-all shrink-0">
                    বিস্তারিত দেখুন <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="bg-[#FAFAFA] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-black/5 hover:border-primary/20 transition-colors">
                  <div className="grid grid-cols-2 gap-3 md:gap-4 divide-x divide-black/10">
                    
                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center px-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white shadow-sm shadow-black/5 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-2xl md:text-4xl font-bold text-foreground tabular-nums tracking-tighter mb-1">
                        {toBn(activeNode.stats.madrasas)}<span className="text-primary">+</span>
                      </p>
                      <p className="text-[10px] md:text-sm text-muted-foreground font-bold">মোট মাদ্রাসা</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center text-center px-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white shadow-sm shadow-black/5 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-2xl md:text-4xl font-bold text-foreground tabular-nums tracking-tighter mb-1">
                        {activeNode.stats.students}
                      </p>
                      <p className="text-[10px] md:text-sm text-muted-foreground font-bold">সক্রিয় শিক্ষার্থী</p>
                    </div>

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
