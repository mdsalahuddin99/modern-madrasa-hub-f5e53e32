"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { 
  Target, Eye, ShieldCheck, Search, PhoneCall, 
  BookOpen, HeartHandshake, ChevronRight, CheckCircle2, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn, toBn } from "@/lib/utils";

export default function AboutClient() {
  const { content } = useSiteContent();
  const { about } = content.pages;
  const { stats, cta } = content;

  const getFeatureIcon = (index: number) => {
    switch (index) {
      case 0: return <ShieldCheck className="w-6 h-6" />;
      case 1: return <Search className="w-6 h-6" />;
      case 2: return <HeartHandshake className="w-6 h-6" />;
      case 3: return <PhoneCall className="w-6 h-6" />;
      default: return <CheckCircle2 className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* App-Style Immersive Hero */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 islamic-pattern opacity-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-5 sm:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 active-scale"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-black uppercase tracking-widest">আমাদের গল্প</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6"
            >
              {about.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              {about.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/madrasas"
                className="w-full sm:w-auto px-8 py-4 bg-accent text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-accent/20 active-scale flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                মাদ্রাসা খুঁজুন
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest active-scale flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                যোগাযোগ
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid - App Widgets */}
        <section className="container mx-auto px-5 -mt-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-soft text-center group active-scale"
              >
                <div className="text-3xl font-black text-primary mb-1 tabular-nums group-hover:scale-110 transition-transform">
                  {toBn(stat.value)}{stat.suffix}
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission & Vision - Premium Cards */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-5 sm:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card p-10 rounded-[3rem] border border-border/40 shadow-soft relative overflow-hidden group active-scale"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-4">{about.mission.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-90">
                  {about.mission.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card p-10 rounded-[3rem] border border-border/40 shadow-soft relative overflow-hidden group active-scale"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[4rem]" />
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform">
                  <Eye className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-4">{about.vision.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-90">
                  {about.vision.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features - Icon Grid */}
        <section className="py-20 lg:py-32 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-5 sm:px-8 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-foreground mb-6">
                {about.features.title}
              </h2>
              <p className="text-muted-foreground text-lg font-medium opacity-90">
                আমরা আধুনিক প্রযুক্তির মাধ্যমে দ্বীনি শিক্ষার প্রচার ও প্রসারে কাজ করে যাচ্ছি।
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.features.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft hover:border-primary/20 transition-all group active-scale"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {getFeatureIcon(i)}
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Same as Homepage Style */}
        <section className="container mx-auto px-5 sm:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary p-10 lg:p-20 rounded-[3rem] text-white relative overflow-hidden text-center shadow-2xl shadow-primary/20"
          >
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 border border-white/20 backdrop-blur-md">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                {cta.title} <br className="hidden sm:block" />
                <span className="text-accent">{cta.titleLine2}</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-4 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active-scale flex items-center justify-center gap-2"
                >
                  {cta.buttonText}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/madrasas"
                  className="w-full sm:w-auto px-10 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest active-scale flex items-center justify-center"
                >
                  মাদ্রাসা তালিকা
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
