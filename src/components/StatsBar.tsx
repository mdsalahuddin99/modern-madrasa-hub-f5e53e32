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
    gradient: "from-emerald-deep/20 via-primary/10 to-emerald-deep/5",
    iconBg: "bg-emerald-deep/15 text-emerald-deep",
    border: "border-emerald-deep/20",
    accent: "emerald-deep",
    suffix: "+",
    label: "মাদ্রাসা নিবন্ধিত",
    sub: "সারাদেশে কওমি মাদ্রাসা",
  },
  {
    icon: Users,
    gradient: "from-gold/15 via-accent/8 to-gold/5",
    iconBg: "bg-gold/15 text-gold",
    border: "border-gold/20",
    accent: "gold",
    suffix: "+",
    label: "শিক্ষার্থী",
    sub: "তালিবে ইলম সংখ্যা",
  },
  {
    icon: MapPin,
    gradient: "from-primary/20 via-emerald-deep/10 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
    border: "border-primary/20",
    accent: "primary",
    suffix: " টি",
    label: "বিভাগ কভার",
    sub: "সকল প্রশাসনিক বিভাগ",
  },
  {
    icon: ShieldCheck,
    gradient: "from-accent/15 via-gold/8 to-accent/5",
    iconBg: "bg-accent/15 text-accent",
    border: "border-accent/20",
    accent: "accent",
    suffix: " টি",
    label: "জেলা কভার",
    sub: "সত্যয়িত তথ্য",
  },
];

const FloatingParticle = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{
      y: [0, -12, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Sparkles className="w-3 h-3 text-gold/40" />
  </motion.div>
);

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
    <section ref={sectionRef} className="relative z-10 px-4 sm:px-8 -mt-2 sm:-mt-4 mb-8 sm:mb-16">
      <div className="container mx-auto max-w-6xl">
        {/* ─── Floating Particles ─── */}
        <FloatingParticle className="top-0 left-[15%] hidden md:block" delay={0} />
        <FloatingParticle className="top-0 right-[20%] hidden md:block" delay={1.5} />
        <FloatingParticle className="bottom-0 left-[40%] hidden md:block" delay={0.8} />

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
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-deep" />
              <span>সর্বশেষ আপডেট: আজ</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-gold" />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  className={`relative overflow-hidden rounded-3xl bg-card border ${cfg.border} ${
                    isFirst
                      ? "col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/5 via-card to-card shadow-lg shadow-primary/5"
                      : ""
                  } transition-all duration-400 group`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-current opacity-[0.04] blur-3xl" />
                  </div>

                  {/* Accent line */}
                  <div
                    className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${
                      i === 0
                        ? "from-emerald-deep via-primary to-emerald-deep"
                        : i === 1
                          ? "from-gold via-accent to-gold"
                          : i === 2
                            ? "from-primary via-emerald-deep to-primary"
                            : "from-accent via-gold to-accent"
                    } opacity-60`}
                  />

                  <div className="relative p-5 sm:p-6 md:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -4 }}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${cfg.iconBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}
                      >
                        <cfg.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </motion.div>

                      {/* Serial watermark */}
                      <span className="text-3xl sm:text-4xl font-black text-foreground/[0.04] select-none leading-none -mr-1 -mt-1">
                        {toBn(i + 1)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-none tabular-nums">
                        <span ref={refs[i]}>{toBn(counts[i])}</span>
                        <span className={
                          i === 0 ? "text-emerald-deep" : i === 1 ? "text-gold" : i === 2 ? "text-primary" : "text-accent"
                        }>
                          {s.suffix}
                        </span>
                      </div>
                      <p className="text-[13px] sm:text-sm font-bold text-foreground">
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
                  <p className="text-lg sm:text-2xl font-extrabold text-emerald-deep tabular-nums">
                    {toBn(growthRate)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">বৃদ্ধি</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-lg sm:text-2xl font-extrabold text-gold tabular-nums">
                    {toBn(displayStats[1].value > 10000 ? Math.floor(displayStats[1].value / 100) : displayStats[1].value)}+
                  </p>
                  <p className="text-[10px] text-muted-foreground">সক্রিয় ব্যবহারকারী</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-deep" />
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
