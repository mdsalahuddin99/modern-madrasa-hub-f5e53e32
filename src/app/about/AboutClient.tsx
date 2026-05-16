// ===================================================
// About Client Component — ক্লায়েন্ট-সাইড অ্যানিমেশন
// ===================================================

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion } from "framer-motion";

export default function AboutClient() {
  const { content } = useSiteContent();
  const { about } = content.pages;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-16 bg-gradient-to-b from-emerald-700 to-emerald-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-extrabold text-white mb-3"
          >
            {about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm md:text-lg max-w-xl mx-auto"
          >
            {about.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="py-8 md:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border p-5 md:p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-2">🎯 {about.mission.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {about.mission.description}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border p-5 md:p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-2">👁️ {about.vision.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {about.vision.description}
              </p>
            </motion.div>
          </div>

          {/* Features */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-extrabold text-foreground text-center mb-6"
          >
            {about.features.title}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.features.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border p-5 hover:border-emerald-500/50 transition-colors shadow-sm"
              >
                <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
