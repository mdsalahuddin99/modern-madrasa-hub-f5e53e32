"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toBn } from "@/lib/utils";

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

const StatsBar = ({ stats }: { stats?: any }) => {
  const { content } = useSiteContent();
  const displayStats = stats
    ? [
        { value: stats.totalMadrasas || 524, suffix: "+", label: "নিবন্ধিত মাদ্রাসা" },
        { value: stats.totalStudents || 12500, suffix: "+", label: "সক্রিয় শিক্ষার্থী" },
        { value: stats.totalDivisions || 8, suffix: "টি", label: "বিভাগ কভার" },
        { value: stats.totalDistricts || 64, suffix: "টি", label: "জেলা কভার" },
      ]
    : content.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }));

  return (
    <section className="pb-2 lg:pb-8 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        <div className="bg-[#FAFAFA] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-20 border border-black/5 shadow-2xl shadow-black/5 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {displayStats.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tighter mb-2 md:mb-4 tabular-nums transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                  {toBn(s.value)}<span className="text-primary font-light">{s.suffix}</span>
                </div>
                <p className="text-xs lg:text-sm font-bold text-muted-foreground tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsBar;
