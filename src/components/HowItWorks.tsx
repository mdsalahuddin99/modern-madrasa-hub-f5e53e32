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
    <section id="how-it-works" className="py-12 lg:py-16 relative overflow-hidden bg-[#FAFAFA]">
      
      {/* Decorative Luxe Background Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white text-primary rounded-full text-xs font-bold mb-6 shadow-sm border border-black/5">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> ব্যবহার নির্দেশিকা
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
            সহজ <span className="text-primary font-light">৩ ধাপে শুরু করুন</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto relative">
          
          {/* Vertical Spine Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 transform md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
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
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 rounded-full bg-primary border-[5px] border-[#FAFAFA] transform -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(227,43,60,0.4)] group-hover:scale-125 transition-transform duration-500" />

                  {/* Content Card */}
                  <div className="w-full md:w-[45%] lg:w-[42%] pl-16 md:pl-0">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="bg-white p-8 lg:p-10 rounded-[2rem] border border-black/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group/card"
                    >
                      {/* Faded Step Number Background */}
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center -rotate-12 group-hover/card:rotate-0 transition-transform duration-700">
                         <span className="text-7xl font-bold text-primary/10 select-none">
                            {toBn(i + 1)}
                         </span>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover/card:bg-primary transition-colors duration-500">
                            <Icon className="w-7 h-7 text-primary group-hover/card:text-white transition-colors" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover/card:text-primary transition-colors">
                            {step.title}
                          </h3>
                        </div>

                        <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>

                      {/* Small Call to action */}
                      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary group-hover/card:text-primary/80 transition-colors cursor-pointer">
                         আরও জানুন 
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/card:bg-primary/20 transition-colors">
                           <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/card:translate-x-0.5" />
                         </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty spacer for Desktop Grid */}
                  <div className="hidden md:block w-[45%] lg:w-[42%]" />
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
