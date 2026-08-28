"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Gift,
  Clock,
  Shield,
  Zap,
  Users,
  Star,
  TrendingUp,
  Quote,
  Award,
  Handshake,
  ArrowUp,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
    let start: number | null = null;
    const fn = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(fn);
    };
    requestAnimationFrame(fn);
  }, [inView, end, duration]);
  return { count, ref };
}

const recentActivity = [
  { name: "জামিয়া রহমানিয়া", loc: "চট্টগ্রাম", ago: "২ মি. আগে", initials: "জা" },
  { name: "আল-মারকাজুল ইসলামী", loc: "ঢাকা", ago: "১৫ মি. আগে", initials: "আ" },
  { name: "দারুল হাদিস লতিফিয়া", loc: "সিলেট", ago: "৪১ মি. আগে", initials: "দা" },
  { name: "মাদ্রাসাতুল হেরা", loc: "রাজশাহী", ago: "১ ঘ. আগে", initials: "মা" },
  { name: "জামিয়া ইসলামিয়া ইউনুসিয়া", loc: "বরিশাল", ago: "২ ঘ. আগে", initials: "জা" },
];

const reviewQuotes = [
  { text: "আমাদের মাদ্রাসার তথ্য যোগ করার পর অনেক অভিভাবক আমাদের খুঁজে পাচ্ছেন। ভর্তির হার ৪০% বেড়েছে!", name: "মাওলানা আব্দুর রহিম", role: "মুহতামিম, জামিয়া রহমানিয়া" },
  { text: "বিনামূল্যে এত সুন্দর একটি প্ল্যাটফর্ম পেয়ে আমরা সত্যিই উপকৃত হয়েছি।", name: "মুফতি সাইফুল ইসলাম", role: "প্রধান, দারুল উলুম মাদ্রাসা" },
  { text: "আমাদের প্রতিষ্ঠানের ডিজিটাল উপস্থিতি তৈরি করতে এই প্ল্যাটফর্ম অনন্য ভূমিকা রেখেছে।", name: "মুহাম্মদ ইব্রাহিম", role: "সহকারী মুহতামিম, আল-জামিয়াতুল ইসলামিয়া" },
];

const whyWait = [
  { icon: Users, label: "৫০০+ মাদ্রাসা ইতিমধ্যে যোগ দিয়েছে" },
  { icon: TrendingUp, label: "গড়ে ৪০% বেশি অভিভাবক খুঁজে পান" },
  { icon: Star, label: "ফ্রি প্রোফাইল + সত্যায়িত ব্যাজ" },
  { icon: Target, label: "সারাদেশের ৬৪ জেলায় পৌঁছান" },
];

const benefits = [
  { icon: Gift, label: "বিনামূল্যে" },
  { icon: Clock, label: "২৪/৭ সাপোর্ট" },
  { icon: Zap, label: "১ মিনিটেই নিবন্ধন" },
];

const CTASection = () => {
  const router = useRouter();
  const { content } = useSiteContent();
  const cta = content.cta;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { count: madrasaCount, ref: mRef } = useCountUp(524);
  const { count: weeklyCount, ref: wRef } = useCountUp(48);
  const [activeQuote, setActiveQuote] = useState(0);
  const [showUrgency, setShowUrgency] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setShowUrgency(true), 800);
    const qi = setInterval(() => setActiveQuote((p) => (p + 1) % reviewQuotes.length), 4500);
    return () => { clearTimeout(t1); clearInterval(qi); };
  }, [inView]);

  const slotsLeft = Math.max(12, 60 - weeklyCount);

  return (
    <section id="cta" className="section-padding pb-10 sm:pb-16 relative overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/15 mb-5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs sm:text-sm font-semibold">আপনার মাদ্রাসা কি এখনও তালিকাভুক্ত নয়?</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
              {cta.title}
              <br />
              <span className="text-primary">{cta.titleLine2}</span>
            </h2>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {cta.description}
            </p>
          </motion.div>

          {/* ─── Main Grid ─── */}
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 sm:gap-7">
            {/* ─── LEFT ─── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-border/30 shadow-sm"
            >
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40" />
              <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-7">
                {/* Live counter */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/15 text-xs sm:text-sm font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="font-extrabold" ref={wRef}>{toBn(weeklyCount)}</span>টি মাদ্রাসা এই সপ্তাহে যোগ দিয়েছে
                </div>

                {/* Urgency bar */}
                <AnimatePresence>
                  {showUrgency && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/15">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
                            <Target className="w-4 h-4 text-primary" />
                            <span>সাপ্তাহিক লক্ষ্য: <span className="text-foreground font-extrabold">{toBn(60)}টি</span></span>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-primary">{toBn(weeklyCount)}/{toBn(60)}</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-primary/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(weeklyCount / 60) * 100}%` }}
                            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 relative"
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                          </motion.div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {slotsLeft > 0
                              ? `মাত্র ${toBn(slotsLeft)}টি বাকি — এই সপ্তাহের অফার`
                              : "লক্ষ্য পূরণ হয়েছে! আগামী সপ্তাহের জন্য অপেক্ষা করুন।"}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <ArrowUp className="w-3 h-3" />
                            <span>১২৭% গ্রোথ</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Why Wait grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {whyWait.map(({ icon: Icon, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                      className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl bg-primary/[0.04] border border-primary/10 hover:bg-primary/[0.07] hover:border-primary/20 transition-all group"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/80 font-semibold leading-snug">
                        {label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Benefits pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {benefits.map(({ icon: Icon, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.3 }}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-primary/5 border border-primary/15 text-xs sm:text-sm font-semibold text-primary"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      {label}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary"
                  >
                    <Award className="w-3.5 h-3.5" />
                    ফ্রি প্রোফাইল
                  </motion.div>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  onMouseEnter={() => setHoverBtn(true)}
                  onMouseLeave={() => setHoverBtn(false)}
                >
                  <Button
                    onClick={() => router.push("/signup")}
                    className={`relative h-14 sm:h-16 px-7 sm:px-10 rounded-2xl text-base sm:text-lg font-bold transition-all duration-500 gap-2.5 ${
                      hoverBtn
                        ? "bg-primary text-white shadow-xl shadow-primary/30 -translate-y-0.5"
                        : "bg-primary text-white shadow-lg shadow-primary/20"
                    }`}
                  >
                    {cta.buttonText}
                    <motion.span
                      animate={hoverBtn ? { x: [0, 4, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Button>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-2.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ক্রেডিট কার্ডের প্রয়োজন নেই — ১ মিনিট সময় লাগে — যেকোনো সময় ক্যান্সেল
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* ─── RIGHT ─── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Recent signups */}
              <div className="rounded-2xl sm:rounded-3xl bg-card border border-border/30 shadow-sm p-5 sm:p-6 md:p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <h3 className="text-sm font-bold text-foreground">সদ্য তালিকাভুক্ত</h3>
                  <span className="text-[10px] text-muted-foreground ml-auto font-medium">লাইভ</span>
                </div>
                <div className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/[0.03] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {item.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.loc}</p>
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 shrink-0">{item.ago}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Review carousel */}
              <div className="rounded-2xl sm:rounded-3xl bg-card border border-border/30 shadow-sm p-5 sm:p-6 md:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuote}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Quote className="w-5 h-5 text-primary/30 mb-2.5" />
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
                      &ldquo;{reviewQuotes[activeQuote].text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-[10px] font-bold">
                        {reviewQuotes[activeQuote].name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {reviewQuotes[activeQuote].name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {reviewQuotes[activeQuote].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-1.5 mt-4 justify-center">
                  {reviewQuotes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveQuote(i)}
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        i === activeQuote ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Shield, label: "সরকারি অনুমোদিত" },
                  { icon: Award, label: "সত্যায়িত প্রোফাইল" },
                  { icon: Handshake, label: "১০০% নিরাপদ" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/[0.04] border border-primary/10 text-[10px] font-semibold text-muted-foreground"
                  >
                    <Icon className="w-3 h-3 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─── Bottom stats bar ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-card border border-border/30 shadow-sm"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums">
                  <span ref={mRef}>{toBn(madrasaCount)}</span><span className="text-primary">+</span>
                </p>
                <p className="text-xs text-muted-foreground font-medium">মোট নিবন্ধিত</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums">
                  <span>১২,৫০০</span><span className="text-primary">+</span>
                </p>
                <p className="text-xs text-muted-foreground font-medium">শিক্ষার্থী</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums">
                  <span>৬৪</span><span className="text-primary">টি</span>
                </p>
                <p className="text-xs text-muted-foreground font-medium">জেলা কভার</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums">
                  <span className="text-primary">১২৭</span><span className="text-primary">%</span>
                </p>
                <p className="text-xs text-muted-foreground font-medium">বৃদ্ধি (এই মাসে)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
