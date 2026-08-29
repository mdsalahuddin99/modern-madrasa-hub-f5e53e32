import { motion } from "framer-motion";
import { Users, GraduationCap, Calendar, Building2 } from "lucide-react";
import { Madrasa } from "@/data/madrasas";
import { useEffect, useState } from "react";
import { toBn } from "@/lib/utils";
import { cn } from "@/lib/utils";

const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{toBn(count)}</>;
};

const ProfileStats = ({ madrasa }: { madrasa: Madrasa }) => {
  const stats = [
    { icon: Calendar, label: "স্থাপিত", value: madrasa.established, isAnimated: false, color: "text-primary", bg: "bg-primary/5" },
    { icon: Users, label: "শিক্ষার্থী", value: madrasa.students, suffix: "+", isAnimated: true, color: "text-accent", bg: "bg-accent/5" },
    { icon: GraduationCap, label: "শিক্ষক", value: madrasa.teachers, suffix: "+", isAnimated: true, color: "text-primary", bg: "bg-primary/5" },
    { icon: Building2, label: "বোর্ড", value: madrasa.board, isAnimated: false, color: "text-accent", bg: "bg-accent/5" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="bg-white/90 dark:bg-card/90 backdrop-blur-xl p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-primary/5 flex flex-col items-center text-center group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
        >
          {/* Subtle background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10", item.bg)}>
            <item.icon className={cn("w-6 h-6", item.color)} strokeWidth={2.5} />
          </div>
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            {item.label}
          </p>
          <div className="text-lg font-bold text-foreground tabular-nums">
            {item.isAnimated ? (
              <div className="flex items-center justify-center">
                <AnimatedNumber target={item.value as number} />
                <span className="ml-0.5 text-base">{item.suffix}</span>
              </div>
            ) : (
              <span className="line-clamp-1">{item.value}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats;

