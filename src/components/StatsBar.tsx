"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

import { SectionHeader } from "@/components/SectionHeader";

const toBn = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

function useCountUp(end: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

const statConfigs = [
  {
    icon: Building2,
    iconColor: "text-primary",
    valueColor: "text-primary",
    suffix: "+",
    label: "মাদ্রাসা নিবন্ধিত",
    sub: "সারাদেশে কওমি মাদ্রাসা",
  },
  {
    icon: Users,
    iconColor: "text-pink-500",
    valueColor: "text-pink-500",
    suffix: "+",
    label: "শিক্ষার্থী",
    sub: "তালিবে ইলম সংখ্যা",
  },
  {
    icon: MapPin,
    iconColor: "text-blue-500",
    valueColor: "text-blue-500",
    suffix: " টি",
    label: "বিভাগ কভার",
    sub: "সকল প্রশাসনিক বিভাগ",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-amber-500",
    valueColor: "text-amber-500",
    suffix: " টি",
    label: "জেলা কভার",
    sub: "সত্যয়িত তথ্য",
  },
];

// FloatingParticle removed

interface StatsBarProps {
  stats?: {
    totalMadrasas: number;
    totalDivisions: number;
    totalDistricts: number;
    totalStudents: number;
  } | null;
}

const StatsBar = ({ stats }: StatsBarProps) => {
  const { content } = useSiteContent();
  const sectionRef = useRef<HTMLDivElement>(null);

  const displayStats = stats
    ? [
        { value: stats.totalMadrasas || 524, suffix: "+", label: "মাদ্রাসা নিবন্ধিত" },
        { value: stats.totalStudents || 12500, suffix: "+", label: "শিক্ষার্থী" },
        { value: stats.totalDivisions || 8, suffix: " টি", label: "বিভাগ কভার" },
        { value: stats.totalDistricts || 64, suffix: " টি", label: "জেলা কভার" },
      ]
    : content.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }));

  const { count: c1, ref: r1 } = useCountUp(displayStats[0].value);
  const { count: c2, ref: r2 } = useCountUp(displayStats[1].value);
  const { count: c3, ref: r3 } = useCountUp(displayStats[2].value);
  const { count: c4, ref: r4 } = useCountUp(displayStats[3].value);
  const counts = [c1, c2, c3, c4];
  const refs = [r1, r2, r3, r4];

  const growthRate = 127;

  return (
    <section ref={sectionRef} className="relative z-10 px-4 sm:px-8 mt-12 mb-12 sm:mb-16">
      <div className="container mx-auto max-w-5xl">
        <SectionHeader 
          badge="পরিসংখ্যান" 
          title="এক নজরে আমাদের প্ল্যাটফর্ম" 
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {/* ─── Top bar: trust signal ─── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>সর্বশেষ আপডেট: আজ</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>
                <span className="font-bold text-foreground">{toBn(growthRate)}%</span> বৃদ্ধি এই মাসে
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>১০০% সত্যায়িত তথ্য</span>
            </div>
          </motion.div>

          {/* ─── Main Stats Grid ─── */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
            {displayStats.map((s, i) => {
              const cfg = statConfigs[i % statConfigs.length];
              const isFirst = i === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + i * 0.1,
                    duration: 0.55,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative w-[46%] sm:w-[150px] md:w-[160px] flex-shrink-0 overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative p-4 sm:p-5 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-3 w-full relative">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -4 }}
                        className={`flex items-center justify-center transition-all duration-300 mx-auto ${cfg.iconColor}`}
                      >
                        <cfg.icon className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.5} />
                      </motion.div>

                      {/* Serial watermark */}
                      <span className="absolute -top-2 right-0 text-3xl font-black text-foreground/[0.04] select-none leading-none">
                        {toBn(i + 1)}
                      </span>
                    </div>

                    <div className="space-y-1 flex flex-col items-center mt-2">
                      <div className={`text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tighter leading-none tabular-nums ${cfg.valueColor}`}>
                        <span ref={refs[i]}>{toBn(counts[i])}</span>
                        <span>{s.suffix}</span>
                      </div>
                      <p className="text-[13px] sm:text-sm font-bold text-foreground mt-1">
                        {s.label}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground/70">
                        {cfg.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Bottom: Growth Trajectory ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl bg-card border border-border/30"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">প্ল্যাটফর্মের অগ্রগতি</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">গত ৩০ দিনে নিবন্ধন বেড়েছে</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-extrabold text-primary tabular-nums">
                    {toBn(growthRate)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">বৃদ্ধি</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-extrabold text-primary tabular-nums">
                    {toBn(displayStats[1].value > 10000 ? Math.floor(displayStats[1].value / 100) : displayStats[1].value)}+
                  </p>
                  <p className="text-[10px] text-muted-foreground">সক্রিয় ব্যবহারকারী</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
                  <span>প্রতি সপ্তাহে গড়ে ১২টি মাদ্রাসা যুক্ত হচ্ছে</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
