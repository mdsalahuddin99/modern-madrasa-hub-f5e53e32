"use client";

import { motion } from "framer-motion";
import { Search, ClipboardCheck, Phone, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const stepIcons = [Search, ClipboardCheck, Phone];

const stepColors = [
  { bg: "bg-primary", shadow: "shadow-primary/25", light: "bg-primary/10", text: "text-primary", line: "from-primary" },
];

const toBanglaNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

const HowItWorks = () => {
  const { content } = useSiteContent();
  const { badge, title, steps } = content.howItWorks;

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden scroll-mt-24 bg-violet-50/50 dark:bg-violet-900/20">
      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-header max-w-2xl lg:max-w-none mx-auto text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15] z-10 relative lg:whitespace-nowrap">
            সহজ ৩ ধাপে শুরু করুন
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main vertical dashed line (visible mainly on mobile, or as the spine on desktop) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0 border-l-[1.5px] border-dashed border-primary/40 transform md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              const stepNumber = toBanglaNum(i + 1);

              return (
                <div
                  key={i}
                  className={`relative flex items-center md:justify-between ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } group`}
                >
                  {/* Decorative dot on the line */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 border-2 border-background z-20 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                  {/* Horizontal dashed line connecting dot to card (Desktop only) */}
                  <div
                    className={`hidden md:block absolute top-1/2 w-[calc(50%-1.5rem)] h-0 border-t-[1.5px] border-dashed border-primary/40 z-0 ${
                      isEven ? "left-1/2" : "right-1/2"
                    }`}
                  />

                  {/* Card Container */}
                  <div className="w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 border border-primary/20 group cursor-default"
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent z-0" />
                      
                      {/* Top-right corner gradient blob */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0 transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

                      {/* Step Badge */}
                      <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-10">
                        <div className="px-3 py-1 rounded-xl border border-primary/30 text-primary text-[11px] font-bold bg-background/50 backdrop-blur-sm shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-300">
                          Step - {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pr-20 relative z-10">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty spacer for the other half of the flex container */}
                  <div className="hidden md:block w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
