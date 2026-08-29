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
    <section className="py-10 lg:py-16 relative overflow-hidden bg-white border-t border-black/5">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header - Luxe Style */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-bold mb-4 shadow-sm border border-black/5">
            <Award className="w-3.5 h-3.5 mr-2" /> অনুমোদিত বোর্ডসমূহ
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            স্বীকৃত <span className="text-primary font-light">শিক্ষা বোর্ডসমূহ</span>
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base font-medium max-w-2xl mx-auto">
            বাংলাদেশের কওমি ও ইসলামি শিক্ষার স্বীকৃত বোর্ডসমূহের অধীনে পরিচালিত মাদ্রাসাসমূহ যারা প্ল্যাটফর্মে নিবন্ধিত।
          </p>
        </div>

        {/* Marquee Track Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Fades for Desktop */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden lg:block" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden lg:block" />

          <div className="overflow-hidden group pt-6 pb-10 lg:pb-16">
            <div className="flex gap-12 lg:gap-24 animate-marquee group-hover:[animation-play-state:paused]">
              {marqueeItems.map((board, i) => (
                <a
                  key={`${board.id}-${i}`}
                  href={board.website || "#"}
                  target={board.website ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center justify-center outline-none"
                >
                  <div className="relative group/logo">
                    {board.logoUrl ? (
                      <img
                        src={board.logoUrl}
                        alt={board.abbr}
                        className="h-16 lg:h-20 w-auto object-contain grayscale opacity-80 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110 transition-all duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 opacity-90 group-hover/logo:opacity-100 transition-all duration-500 group-hover/logo:-translate-y-1">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                          <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-foreground">{board.abbr}</span>
                      </div>
                    )}

                    {/* Luxe Tooltip */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-20 group-hover/logo:-translate-y-2">
                       <span className="text-[11px] font-bold text-white bg-foreground px-4 py-1.5 rounded-full shadow-xl">
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
        <div className="mt-8 lg:mt-12 flex items-center justify-center gap-4 opacity-70">
           <div className="h-px w-12 bg-black/10" />
           <span className="text-xs font-bold text-muted-foreground">
              সর্বমোট {toBn(boards.length)}টি শিক্ষা বোর্ড অন্তর্ভুক্ত
           </span>
           <div className="h-px w-12 bg-black/10" />
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
