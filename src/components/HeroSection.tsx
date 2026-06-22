"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Sparkles, Star, BookOpen } from "lucide-react";
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

const FloatingOrnament = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 rotate-45 flex items-center justify-center">
      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gold/60 -rotate-45" />
    </div>
  </motion.div>
);

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { content } = useSiteContent();
  const hero = content.hero;
  const sectionRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const imgX = useTransform(mx, [-600, 600], [10, -10]);
  const imgY = useTransform(my, [-400, 400], [6, -6]);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const handleMouse = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
          style={{ x: imgX, y: imgY }}
        >
          <Image
            src={slides[current].image}
            alt={slides[current].alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      <div className="absolute inset-0 islamic-pattern opacity-30 mix-blend-overlay" />

      <motion.div
        className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-deep/30 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/15 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      <FloatingOrnament className="top-[15%] left-[8%] hidden lg:block" delay={0} />
      <FloatingOrnament className="top-[25%] right-[10%] hidden lg:block" delay={1.5} />
      <FloatingOrnament className="bottom-[30%] left-[12%] hidden lg:block" delay={3} />

      <div className="relative z-10 h-full min-h-[100svh] flex flex-col justify-center safe-bottom">
        <div className="container mx-auto px-5 sm:px-8 pt-20 pb-12 sm:pb-20 md:pb-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full hero-glass-card mb-8 sm:mb-10">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                </motion.div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {hero.subtitle}
                </span>
                <motion.div
                  animate={{ rotate: [0, -15, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[34px] sm:text-5xl md:text-6xl lg:text-[76px] font-extrabold text-white leading-[1.08] mb-6 sm:mb-8 tracking-tight"
            >
              {hero.title}
              <br />
              <span className="text-gradient-gold">{hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-8 sm:mb-10"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3.5"
            >
              <Button
                size="lg"
                className="h-13 sm:h-14 px-8 sm:px-10 text-sm font-bold rounded-2xl shimmer-btn gradient-btn text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.4)] transition-all duration-500 touch-target focus-visible:ring-2 focus-visible:ring-ring group"
                onClick={() => router.push("/madrasas")}
              >
                <Search className="w-4.5 h-4.5 mr-2.5 group-hover:scale-110 transition-transform" />
                {hero.searchBtnText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 sm:h-14 px-8 sm:px-10 text-sm font-bold rounded-2xl border-white/15 text-white bg-white/8 backdrop-blur-xl hover:bg-white/15 hover:text-white hover:border-white/25 transition-all duration-300 touch-target focus-visible:ring-2 focus-visible:ring-ring group"
                onClick={() => router.push("/signup")}
              >
                <BookOpen className="w-4.5 h-4.5 mr-2.5 group-hover:scale-110 transition-transform" />
                {hero.registerBtnText}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex items-center gap-3 mt-12 sm:mt-16"
          >
            <button
              onClick={prev}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all backdrop-blur-sm touch-target"
              aria-label="আগের স্লাইড"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all backdrop-blur-sm touch-target"
              aria-label="পরের স্লাইড"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 ml-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-500 touch-target ${
                    i === current
                      ? "w-8 h-2 bg-gold shadow-lg shadow-gold/40"
                      : "w-2 h-2 bg-white/25 hover:bg-white/40"
                  }`}
                  aria-label={`স্লাইড ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
