"use client";

import { motion } from "framer-motion";
import {
  BookOpen, School, BookMarked, Sparkles,
  Users, GraduationCap, Award, MoreHorizontal, ArrowRight,
  CheckCircle2, Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap = [BookOpen, School, BookMarked, Sparkles, Users, GraduationCap, Award, MoreHorizontal];

const categoryColors = [
  { bg: "bg-emerald-deep/10", text: "text-emerald-deep", border: "border-emerald-deep/20", hoverBorder: "hover:border-emerald-deep/40", accent: "from-emerald-deep/20 via-transparent to-transparent" },
  { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", hoverBorder: "hover:border-primary/40", accent: "from-primary/20 via-transparent to-transparent" },
  { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20", hoverBorder: "hover:border-gold/40", accent: "from-gold/20 via-transparent to-transparent" },
  { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", hoverBorder: "hover:border-accent/40", accent: "from-accent/20 via-transparent to-transparent" },
  { bg: "bg-emerald-deep/8", text: "text-emerald-deep", border: "border-emerald-deep/15", hoverBorder: "hover:border-emerald-deep/30", accent: "from-emerald-deep/15 via-transparent to-transparent" },
  { bg: "bg-primary/8", text: "text-primary", border: "border-primary/15", hoverBorder: "hover:border-primary/30", accent: "from-primary/15 via-transparent to-transparent" },
  { bg: "bg-gold/8", text: "text-gold", border: "border-gold/15", hoverBorder: "hover:border-gold/30", accent: "from-gold/15 via-transparent to-transparent" },
  { bg: "bg-accent/8", text: "text-accent", border: "border-accent/15", hoverBorder: "hover:border-accent/30", accent: "from-accent/15 via-transparent to-transparent" },
];

const toBanglaNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

const parseBanglaNum = (s: string) => {
  let numStr = "";
  for (const ch of s) {
    const idx = "০১২৩৪৫৬৭৮৯".indexOf(ch);
    if (idx !== -1) numStr += idx.toString();
    else if (ch >= "0" && ch <= "9") numStr += ch;
  }
  return parseInt(numStr, 10) || 0;
};

const CategoriesSection = () => {
  const router = useRouter();
  const { content } = useSiteContent();
  const { badge, title, subtitle, items } = content.categories;

  const totalMadrasas = items.reduce((sum, cat) => sum + parseBanglaNum(cat.count), 0);

  return (
    <section id="categories" className="section-padding pb-10 sm:pb-16 relative overflow-hidden scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-deep/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-gold/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-deep/10 text-emerald-deep border border-emerald-deep/15 mb-5"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-semibold">{badge}</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
            {title}
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>

          {/* Category count indicator */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 border-background ${
                      i === 0 ? "bg-emerald-deep/30" : i === 1 ? "bg-gold/30" : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
              <span><span className="font-bold text-foreground">{toBanglaNum(items.length)}</span>টি ক্যাটাগরি</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-emerald-deep" />
              <span><span className="font-bold text-foreground">{toBanglaNum(totalMadrasas)}+</span> মাদ্রাসা</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Category Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
          {items.map((cat, i) => {
            const Icon = iconMap[i % iconMap.length];
            const color = categoryColors[i % categoryColors.length];
            const isWide = i === 0;

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/madrasas")}
                className={`relative text-left rounded-2xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden border ${color.border} bg-card ${color.hoverBorder} hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group ${
                  isWide ? "col-span-2 md:col-span-2 md:row-span-1 bg-gradient-to-br from-emerald-deep/[0.04] via-card to-card" : ""
                }`}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${color.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Top accent line */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${color.accent} opacity-60`} />

                {/* Serial watermark */}
                <span className="absolute top-3 right-4 text-4xl sm:text-5xl font-black text-foreground/[0.05] select-none leading-none">
                  {toBanglaNum(i + 1)}
                </span>

                {/* Icon */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${isWide ? "bg-emerald-deep text-white shadow-lg shadow-emerald-deep/25" : color.bg} flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${isWide ? "text-white" : color.text}`} />
                </div>

                {/* Name */}
                <h3 className={`font-extrabold text-foreground mb-1.5 leading-snug pr-6 ${isWide ? "text-base sm:text-lg" : "text-[13px] sm:text-base line-clamp-2"}`}>
                  {cat.name}
                </h3>

                {/* Description */}
                <p className={`text-muted-foreground leading-relaxed mb-3 sm:mb-4 ${isWide ? "text-xs sm:text-sm line-clamp-2 max-w-md" : "text-[10px] sm:text-xs line-clamp-2"}`}>
                  {cat.desc}
                </p>

                {/* Bottom: count + arrow */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                    <span className={color.text}>{cat.count}</span>
                    <span className="text-muted-foreground">প্রতিষ্ঠান</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-emerald-deep/10 group-hover:scale-105 transition-all">
                    <ArrowRight className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-deep group-hover:translate-x-0.5 transition-all`} />
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* ─── "View All" card ─── */}
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: items.length * 0.06, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => router.push("/madrasas")}
            className="relative bg-gradient-to-br from-primary/5 via-card to-card border-2 border-dashed border-primary/20 rounded-2xl p-4 sm:p-6 text-left group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/40 cursor-pointer flex flex-col"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-extrabold text-foreground mb-1.5 text-[13px] sm:text-base pr-6">
              সব ক্যাটাগরি
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 sm:mb-4">
              সকল প্রকার মাদ্রাসা দেখুন
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs sm:text-sm font-bold text-primary">সবগুলো দেখুন</span>
              <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-105 transition-all">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
