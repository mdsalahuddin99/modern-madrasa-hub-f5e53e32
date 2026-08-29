"use client";

import { motion } from "framer-motion";
import { Award, Shield } from "lucide-react";
import { cn, toBn } from "@/lib/utils";

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
  if (!boards || boards.length === 0) return null;

  // Duplicate items for a seamless infinite loop
  const marqueeItems = [...boards, ...boards, ...boards, ...boards];

  return (
    <section className="section-padding py-16 lg:py-24 relative overflow-hidden bg-secondary/20 border-t border-border/40">
      <div className="container mx-auto px-5 sm:px-8 max-w-7xl relative z-10">

        {/* Header - Desktop Optimized */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-5 active-scale"
          >
            <Award className="w-4 h-4 text-accent" />
            <span className="text-[11px] lg:text-xs font-black uppercase tracking-[0.2em]">অনুমোদিত বোর্ডসমূহ</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-foreground tracking-tight leading-tight mb-6">
            শিক্ষা বোর্ডসমূহ
          </h2>
          <p className="text-muted-foreground text-sm lg:text-lg leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
            বাংলাদেশের কওমি ও ইসলামি শিক্ষার স্বীকৃত বোর্ডসমূহের অধীনে পরিচালিত মাদ্রাসাসমূহ যারা প্ল্যাটফর্মে নিবন্ধিত।
          </p>
        </div>

        {/* Marquee Track Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Fades for Desktop */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary/80 to-transparent z-10 pointer-events-none hidden lg:block" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary/80 to-transparent z-10 pointer-events-none hidden lg:block" />

          <div className="overflow-hidden group py-4">
            <div className="flex gap-10 lg:gap-20 animate-marquee group-hover:[animation-play-state:paused]">
              {marqueeItems.map((board, i) => (
                <a
                  key={`${board.id}-${i}`}
                  href={board.website || "#"}
                  target={board.website ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center justify-center active-scale tap-highlight-none"
                >
                  <div className="relative group/logo">
                    {board.logoUrl ? (
                      <img
                        src={board.logoUrl}
                        alt={board.abbr}
                        className="h-16 lg:h-24 w-auto object-contain grayscale opacity-50 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-50 group-hover/logo:opacity-100 transition-all duration-500">
                        <Shield className="w-12 h-12 text-primary/60" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">{board.abbr}</span>
                      </div>
                    )}

                    {/* Tooltip for Desktop */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-20">
                       <span className="text-[10px] font-black uppercase tracking-wider text-white bg-primary px-3 py-1 rounded-lg shadow-lg">
                          {board.name}
                       </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 flex items-center justify-center gap-3 opacity-60">
           <div className="h-px w-8 bg-border" />
           <span className="text-[10px] lg:text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
              সর্বমোট {toBn(boards.length)}টি শিক্ষা বোর্ড অন্তর্ভুক্ত
           </span>
           <div className="h-px w-8 bg-border" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BoardsSection;
