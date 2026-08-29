"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Sparkles, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import Image from "next/image";
import heroImg1 from "@/assets/hero-mosque.jpg";
import heroImg2 from "@/assets/hero-madrasa-1.jpg";
import heroImg3 from "@/assets/hero-madrasa-2.jpg";
import heroImg4 from "@/assets/hero-madrasa-3.jpg";

const slides = [
  { image: heroImg1, alt: "মসজিদ" },
  { image: heroImg2, alt: "মাদ্রাসা ভবন" },
  { image: heroImg3, alt: "কুরআন অধ্যয়ন" },
  { image: heroImg4, alt: "মাদ্রাসা ক্যাম্পাস" },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { content } = useSiteContent();
  const hero = content.hero;
  
  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative min-h-[80svh] overflow-hidden bg-background pt-20">
      {/* Background gradients and patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />

      <div className="relative z-10 container mx-auto px-5 sm:px-8 py-12 lg:py-16 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 sm:mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {hero.subtitle}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[38px] sm:text-5xl md:text-6xl font-black text-foreground leading-[1.15] mb-6 tracking-tight"
            >
              {hero.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary relative inline-block">
                {hero.title.split(" ").slice(-1)}
                <svg className="absolute w-full h-[14px] sm:h-4 -bottom-1.5 sm:-bottom-2 left-0 text-primary/70 -z-10" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M3,12 Q50,2 97,10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />
              <span className="text-foreground/90">{hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
            >
              {hero.description}
            </motion.p>

            {/* Action Card inside Hero */}
            <motion.div
              variants={fadeUp}
              className="w-full bg-white rounded-lg p-2 pl-4 sm:pl-6 shadow-xl shadow-primary/5 border border-border/50 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
               <div className="flex items-center gap-3 flex-1 w-full sm:w-auto py-2">
                 <MapPin className="text-primary/60 w-5 h-5" />
                 <div className="flex flex-col">
                   <span className="text-xs text-muted-foreground font-medium">লোকেশন নির্বাচন করুন</span>
                   <span className="text-sm font-bold text-foreground">আপনার বিভাগ বা জেলা</span>
                 </div>
               </div>
               <div className="w-full sm:w-px h-px sm:h-10 bg-border/50 hidden sm:block" />
               <Button
                 size="lg"
                 className="w-full sm:w-auto h-12 sm:h-14 px-8 text-sm font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
                 onClick={() => router.push("/madrasas")}
               >
                 <Search className="w-4 h-4 mr-2" />
                 {hero.searchBtnText}
               </Button>
            </motion.div>
            
            <motion.div variants={fadeUp} className="mt-6">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/5 font-semibold transition-all hover:translate-x-1"
                onClick={() => router.push("/about")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {hero.registerBtnText}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image Slider Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border-[6px] border-white/80"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current].image}
                  alt={slides[current].alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Slider Controls Inside Card */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-md p-1.5 rounded-lg z-20">
               <button
                 onClick={prev}
                 className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
               >
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <button
                 onClick={next}
                 className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
               >
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
