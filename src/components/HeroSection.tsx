"use client";

import { motion } from "framer-motion";
import { Star, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import Image from "next/image";
import heroImg from "@/assets/hero-mosque.jpg";
import { toBn } from "@/lib/utils";

const HeroSection = () => {
  const router = useRouter();
  const { content } = useSiteContent();
  const hero = content.hero;

  return (
    <section className="relative w-full bg-[#FAFAFA] overflow-hidden flex items-center min-h-[90vh] py-24 lg:py-0">
      {/* Soft Background Gradient Glows (Matching Luxe Design) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] aspect-square rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Decorative Dot Pattern */}
      <div className="absolute top-[15%] right-[40%] w-32 h-32 dot-pattern opacity-30 z-0 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-5 md:px-10 lg:px-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 lg:pt-0">

        {/* Left Side: Minimal & Tight Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-2"
          >
            <span className="text-foreground text-[12px] font-bold uppercase tracking-[0.2em] opacity-80">মাদ্রাসা ডিরেক্টরি</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title mb-6 font-bold text-center lg:text-left"
          >
            {hero.title.split(" ")[0]}{" "}
            <span className="text-primary">{hero.title.split(" ").slice(1).join(" ")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-foreground text-sm md:text-base max-w-[320px] mb-8 font-medium leading-relaxed"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Button
              onClick={() => router.push("/madrasas")}
              className="bg-primary hover:bg-primary/90 text-white font-medium h-12 px-8 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-wide"
            >
              বিস্তারিত জানুন
            </Button>
          </motion.div>
        </div>

        {/* Right Side: Creative Composition & Tight Cards */}
        <div className="relative h-[380px] md:h-[450px] lg:h-[600px] w-full flex items-center justify-center mt-6 lg:mt-0">

          {/* Navy Background Blob (Peeking from behind) */}
          <div className="absolute top-[10%] left-[5%] lg:left-[-5%] w-[80%] aspect-square shape-navy z-0" />

          {/* Main Visual in Blob Container - No padding/margin */}
          <div className="relative w-[85%] lg:w-[80%] aspect-square shape-red overflow-hidden z-10">
            <Image
              src={heroImg}
              alt="Architecture"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-[#E32B3C]/5 mix-blend-multiply" />
          </div>

          {/* Floating Data Cards - Hyper Minimal, Shadow-Free */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-[10%] lg:top-[20%] left-0 lg:-left-6 z-20 bg-white shadow-xl shadow-black/5 rounded-2xl p-3 lg:p-4 flex flex-row items-center gap-3 min-w-[120px] lg:min-w-[140px]"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold leading-none tabular-nums text-foreground">{toBn(500)}+</p>
              <p className="text-xs font-medium text-muted-foreground mt-1">ক্যাটাগরি</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-[45%] lg:top-[38%] right-0 lg:-right-8 z-20 bg-white shadow-xl shadow-black/5 rounded-2xl p-3 lg:p-4 flex flex-col items-start min-w-[100px] lg:min-w-[120px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <p className="text-lg font-bold leading-none tabular-nums text-foreground">৪.৮</p>
            </div>
            <p className="text-xs font-medium text-muted-foreground">রেটিং ও রিভিউ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-[5%] lg:bottom-[10%] right-[10%] lg:right-[15%] z-20 bg-white shadow-xl shadow-black/5 rounded-2xl p-3 lg:p-4 flex items-center gap-3 min-w-[150px] lg:min-w-[180px]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-none text-foreground">ভেরিফাইড পোর্টাল</p>
              <p className="text-xs font-medium text-muted-foreground mt-1">৫ বছর সেবা প্রদান</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
