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
  { iconColor: "text-amber-500", iconBg: "bg-amber-500/15", gradient: "from-amber-500/15" },
  { iconColor: "text-blue-500", iconBg: "bg-blue-500/15", gradient: "from-blue-500/15" },
  { iconColor: "text-primary", iconBg: "bg-primary/15", gradient: "from-primary/15" },
  { iconColor: "text-pink-500", iconBg: "bg-pink-500/15", gradient: "from-pink-500/15" },
  { iconColor: "text-purple-500", iconBg: "bg-purple-500/15", gradient: "from-purple-500/15" },
  { iconColor: "text-rose-500", iconBg: "bg-rose-500/15", gradient: "from-rose-500/15" },
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
    <section id="categories" className="section-padding pb-10 sm:pb-16 relative overflow-hidden scroll-mt-24 bg-sky-50/50 dark:bg-sky-900/20">
      {/* Background decoration removed */}

      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl lg:max-w-none mx-auto mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/15 mb-5"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-semibold">{badge}</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15] lg:whitespace-nowrap">
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
                    className="w-5 h-5 rounded-full border-2 border-background bg-primary/30"
                  />
                ))}
              </div>
              <span><span className="font-bold text-foreground">{toBanglaNum(items.length)}</span>টি ক্যাটাগরি</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span><span className="font-bold text-foreground">{toBanglaNum(totalMadrasas)}+</span> মাদ্রাসা</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Category Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/madrasas")}
                className={`relative text-left rounded-lg p-5 sm:p-7 overflow-hidden border border-border/60 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-400 group flex flex-col ${
                  isWide ? "col-span-2 md:col-span-2 md:row-span-1" : ""
                }`}
              >
                {/* Top-left corner radial gradient */}
                <div className={`absolute -top-10 -left-10 w-full h-[150%] sm:h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] ${color.gradient} via-transparent to-transparent opacity-80 pointer-events-none transition-opacity group-hover:opacity-100 z-0`} />
                
                {/* Icon */}
                <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] ${color.iconBg} flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color.iconColor}`} />
                </div>

                {/* Name */}
                <h3 className={`relative z-10 font-bold text-primary mb-2 sm:mb-3 pr-2 text-lg sm:text-[19px] leading-tight`}>
                  {cat.name}
                </h3>

                {/* Description */}
                <p className={`relative z-10 text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-[12px] sm:text-sm ${isWide ? "line-clamp-2 max-w-md" : "line-clamp-2"}`}>
                  {cat.desc}
                </p>

                {/* Bottom: Link */}
                <div className="relative z-10 flex items-center mt-auto font-bold text-primary text-sm gap-1 group-hover:gap-2 transition-all">
                  বিস্তারিত <ArrowRight className="w-4 h-4" />
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
            whileHover={{ scale: 1.01 }}
            onClick={() => router.push("/madrasas")}
            className="relative bg-card border-2 border-dashed border-border/80 rounded-lg p-5 sm:p-7 text-left group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 flex flex-col"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-primary/10 flex items-center justify-center mb-5 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
              <Search className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <h3 className="font-bold text-primary mb-2 sm:mb-3 pr-2 text-lg sm:text-[19px] leading-tight">
              সব ক্যাটাগরি
            </h3>
            <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6 sm:mb-8">
              সকল প্রকার মাদ্রাসা দেখুন
            </p>
            <div className="relative flex items-center mt-auto font-bold text-primary text-sm gap-1 group-hover:gap-2 transition-all">
              সবগুলো দেখুন <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
