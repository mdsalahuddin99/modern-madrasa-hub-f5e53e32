"use client";

import { motion } from "framer-motion";
import { Award, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useRouter } from "next/navigation";

const toBanglaNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

const cardColors = [
  { bg: "bg-emerald-deep/10", text: "text-emerald-deep", border: "border-emerald-deep/20", num: "text-emerald-deep/15", gradient: "from-emerald-deep/20 via-transparent to-transparent" },
  { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", num: "text-primary/15", gradient: "from-primary/20 via-transparent to-transparent" },
  { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20", num: "text-gold/15", gradient: "from-gold/20 via-transparent to-transparent" },
  { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", num: "text-accent/15", gradient: "from-accent/20 via-transparent to-transparent" },
  { bg: "bg-emerald-deep/8", text: "text-emerald-deep", border: "border-emerald-deep/15", num: "text-emerald-deep/12", gradient: "from-emerald-deep/15 via-transparent to-transparent" },
  { bg: "bg-gold/8", text: "text-gold", border: "border-gold/15", num: "text-gold/12", gradient: "from-gold/15 via-transparent to-transparent" },
];

const totalBoards = 6;

const BoardsSection = () => {
  const { content } = useSiteContent();
  const { badge, title, subtitle, items } = content.boards;
  const router = useRouter();

  return (
    <section className="section-padding pb-6 sm:pb-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-deep/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-gold/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        {/* ─── Compact Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-deep/10 text-emerald-deep border border-emerald-deep/15 mb-3.5"
          >
            <Award className="w-3 h-3" />
            <span className="text-[11px] sm:text-xs font-semibold">{badge}</span>
          </motion.div>

          <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
            {title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>

          {/* Compact progress indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="flex gap-1">
              {Array.from({ length: totalBoards }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < items.length ? "bg-emerald-deep" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{toBanglaNum(items.length)}</span>টি বোর্ড
            </span>
          </div>
        </motion.div>

        {/* ─── Compact Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {items.map((b, i) => {
            const color = cardColors[i % cardColors.length];
            const serial = toBanglaNum(i + 1);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`relative bg-card border ${color.border} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center group overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-black/5 cursor-default`}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Top accent line */}
                <div className={`absolute top-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r ${color.gradient} opacity-60`} />

                {/* Serial watermark */}
                <span className={`absolute top-1 right-2 text-2xl sm:text-3xl font-black ${color.num} select-none leading-none`}>
                  {serial}
                </span>

                {/* Compact icon */}
                <div className="relative inline-block">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${color.bg} flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${color.text}`} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold flex items-center justify-center"
                  >
                    <span className="text-[7px] text-white font-bold">{serial}</span>
                  </motion.div>
                </div>

                {/* Compact abbr */}
                <div className="text-[13px] sm:text-sm font-extrabold text-foreground mb-1">{b.abbr}</div>

                {/* Compact full name */}
                <span className="text-[10px] sm:text-xs text-muted-foreground leading-snug block line-clamp-2">
                  {b.name}
                </span>

                {/* Compact bottom indicator */}
                <div className={`mt-2 sm:mt-3 w-5 h-0.5 rounded-full mx-auto ${color.bg} group-hover:w-7 transition-all duration-300`} />
              </motion.div>
            );
          })}

          {/* ─── Compact "View All" card ─── */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: items.length * 0.06, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => router.push("/madrasas")}
            className="relative bg-gradient-to-br from-emerald-deep/5 via-card to-card border-2 border-dashed border-emerald-deep/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center group overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-emerald-deep/10 hover:border-emerald-deep/40 cursor-pointer flex flex-col items-center justify-center min-h-[130px] sm:min-h-[150px]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-deep/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-deep" />
            </div>
            <div className="text-[13px] sm:text-sm font-extrabold text-foreground mb-0.5">সব মাদ্রাসা</div>
            <span className="text-[10px] text-muted-foreground leading-snug block">
              সকল বোর্ডের মাদ্রাসা দেখুন
            </span>
          </motion.button>
        </div>

        {/* ─── Compact Bottom ─── */}
        <div className="mt-5 sm:mt-8 space-y-3">
          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-4 gap-2"
          >
            {[
              { value: toBanglaNum(items.length), label: "বোর্ড" },
              { value: "৫০০+", label: "মাদ্রাসা" },
              { value: "৬৪", label: "জেলা" },
              { value: "১২,৫০০+", label: "শিক্ষার্থী" },
            ].map((s, i) => (
              <div key={i} className="p-2 sm:p-3 rounded-xl bg-card border border-border/30 text-center">
                <p className="text-sm sm:text-base font-extrabold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Compact trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-deep" />
              <span>সত্যায়িত তথ্য</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
              <span>নিয়মিত আপডেট</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              <span>নির্ভরযোগ্য</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BoardsSection;
