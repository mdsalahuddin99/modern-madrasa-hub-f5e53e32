"use client";

import { motion } from "framer-motion";
import { Search, ClipboardCheck, Phone, Sparkles, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { SectionHeader } from "@/components/SectionHeader";
import { cn, toBn } from "@/lib/utils";

const stepIcons = [Search, ClipboardCheck, Phone];

const HowItWorks = () => {
  const { content } = useSiteContent();
  const { steps } = content.howItWorks;

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden scroll-mt-24 bg-secondary/30">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 max-w-7xl relative z-10">
        <SectionHeader
          badge="ব্যবহার নির্দেশিকা"
          title="সহজ ৩ ধাপে শুরু করুন"
          badgeIcon={Sparkles}
        />

        <div className="max-w-5xl mx-auto relative mt-16 lg:mt-24">
          {/* Vertical Spine Line - Centered on Desktop */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-accent/40 to-primary/40 transform md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-24 lg:space-y-32">
            {steps.map((step, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              const isEven = i % 2 === 0;

              return (
                <div
                  key={i}
                  className={cn(
                    "relative flex items-start md:items-center md:justify-between group",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Timeline Node (Dot) */}
                  <div className="absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-card border-4 border-primary transform -translate-x-1/2 z-20 shadow-lg group-hover:scale-125 transition-transform duration-300" />

                  {/* Content Card - Constrained width on Desktop */}
                  <div className="w-full md:w-[42%] lg:w-[40%] pl-14 md:pl-0">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="bg-card p-8 lg:p-10 rounded-[2.5rem] border border-border/40 shadow-soft hover:shadow-xl transition-all active-scale cursor-default overflow-hidden relative group/card"
                    >
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center -rotate-12 group-hover/card:rotate-0 transition-transform duration-500">
                         <span className="text-6xl font-black text-primary/10 select-none">
                            {toBn(i + 1)}
                         </span>
                      </div>

                      <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/card:scale-110">
                          <Icon className="w-8 h-8 text-primary" strokeWidth={2.5} />
                        </div>

                        <div>
                          <h3 className="text-xl lg:text-2xl font-black text-foreground mb-3 group-hover/card:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium opacity-80">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 text-xs font-black text-accent uppercase tracking-[0.2em]">
                         আরও জানুন <ArrowRight className="w-4 h-4 transition-transform group-hover/card:translate-x-2" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty spacer for Desktop Grid to maintain symmetry */}
                  <div className="hidden md:block w-[42%] lg:w-[40%]" />
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
