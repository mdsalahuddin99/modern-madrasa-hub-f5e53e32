"use client";

import { motion } from "framer-motion";
import { Search, ClipboardCheck, Phone, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const stepIcons = [Search, ClipboardCheck, Phone];

const stepColors = [
  { bg: "bg-emerald-deep", shadow: "shadow-emerald-deep/25", light: "bg-emerald-deep/10", text: "text-emerald-deep", line: "from-emerald-deep" },
  { bg: "bg-primary", shadow: "shadow-primary/25", light: "bg-primary/10", text: "text-primary", line: "from-primary" },
  { bg: "bg-gold", shadow: "shadow-gold/25", light: "bg-gold/10", text: "text-gold", line: "from-gold" },
];

const toBanglaNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

const HowItWorks = () => {
  const { content } = useSiteContent();
  const { badge, title, steps } = content.howItWorks;

  return (
    <section id="how-it-works" className="section-padding bg-card relative overflow-hidden scroll-mt-24">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-header"
        >
          <div className="pill-badge bg-emerald-deep/10 text-emerald-deep mb-5">{badge}</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-foreground mb-3 sm:mb-4 tracking-tight">
            {title}
          </h2>
        </motion.div>

        {/* Mobile: vertical timeline */}
        <div className="flex flex-col md:hidden gap-0 relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-deep/30 via-primary/30 to-gold/30" />

          {steps.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            const color = stepColors[i % stepColors.length];
            const isLast = i === steps.length - 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`flex gap-4 relative ${!isLast ? "pb-6" : ""}`}
              >
                {/* Number circle */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl ${color.bg} flex items-center justify-center shadow-lg ${color.shadow}`}>
                  <span className="text-white font-extrabold text-base">{toBanglaNum(i + 1)}</span>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-background border border-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-xl ${color.light} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${color.text}`} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-[42px]">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: horizontal cards with connectors */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 relative">
          {/* Connector lines */}
          <div className="absolute top-[52px] left-[calc(33.33%-12px)] w-[calc(33.33%+24px)] flex items-center justify-center z-0">
            <div className="w-full h-px bg-gradient-to-r from-emerald-deep/40 to-primary/40" />
            <ChevronRight className="absolute text-emerald-deep/40 w-5 h-5 left-1/2 -translate-x-1/2" />
          </div>
          <div className="absolute top-[52px] left-[calc(66.66%-12px)] w-[calc(33.33%+24px)] flex items-center justify-center z-0">
            <div className="w-full h-px bg-gradient-to-r from-primary/40 to-gold/40" />
            <ChevronRight className="absolute text-primary/40 w-5 h-5 left-1/2 -translate-x-1/2" />
          </div>

          {steps.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            const color = stepColors[i % stepColors.length];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center relative z-10"
              >
                {/* Number badge */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className={`relative z-10 inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl ${color.bg} text-white text-lg lg:text-xl font-extrabold mb-6 shadow-xl ${color.shadow} cursor-default`}
                >
                  {toBanglaNum(i + 1)}
                </motion.div>

                {/* Card */}
                <div className="bg-background border border-border/50 rounded-2xl p-6 lg:p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${color.light} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${color.text}`} />
                  </div>
                  <h3 className="text-base lg:text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
