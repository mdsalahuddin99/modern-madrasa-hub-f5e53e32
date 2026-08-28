"use client";

import { motion } from "framer-motion";
import { Award, Shield, ExternalLink } from "lucide-react";

interface Board {
  id: string;
  name: string;
  abbr: string;
  logoUrl: string | null;
  website: string | null;
}

interface BoardsSectionProps {
  boards: Board[];
}

const BoardsSection = ({ boards }: BoardsSectionProps) => {
  // If no boards, don't render the section
  if (!boards || boards.length === 0) return null;

  // Duplicate for seamless infinite loop
  const marqueeItems = [...boards, ...boards, ...boards, ...boards];

  return (
    <section className="section-padding py-10 sm:py-14 relative overflow-hidden bg-amber-50/50 dark:bg-amber-900/20">
      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl lg:max-w-none mx-auto mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/15 mb-3.5"
          >
            <Award className="w-3 h-3" />
            <span className="text-[11px] sm:text-xs font-semibold">অনুমোদিত</span>
          </motion.div>

          <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-foreground tracking-tight leading-[1.15] lg:whitespace-nowrap">
            শিক্ষা বোর্ডসমূহ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            বাংলাদেশের ইসলামি শিক্ষার স্বীকৃত বোর্ডসমূহের অধীনে পরিচালিত মাদ্রাসাসমূহ
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-amber-50/90 dark:from-amber-900/40 to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-amber-50/90 dark:from-amber-900/40 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className="overflow-hidden group">
            <div className="flex gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused]">
              {marqueeItems.map((board, i) => (
                  <a
                    key={`${board.id}-${i}`}
                    href={board.website || "#"}
                    target={board.website ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex-shrink-0 mx-6 sm:mx-10 group/card flex items-center justify-center"
                  >
                    {board.logoUrl ? (
                      <img
                        src={board.logoUrl}
                        alt={board.abbr}
                        className="h-16 sm:h-20 w-auto object-contain grayscale opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-16 sm:h-20 grayscale opacity-70 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-300">
                        <Shield className="w-10 h-10 text-primary/60" />
                      </div>
                    )}
                  </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardsSection;
