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
          className="bg-card p-4 rounded-[1.5rem] border border-border/40 shadow-soft flex flex-col items-center text-center group hover:border-primary/20 transition-all active-scale"
        >
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", item.bg)}>
            <item.icon className={cn("w-5 h-5", item.color)} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">
            {item.label}
          </p>
          <div className="text-sm font-black text-foreground tabular-nums">
            {item.isAnimated ? (
              <div className="flex items-center justify-center">
                <AnimatedNumber target={item.value as number} />
                <span className="ml-0.5">{item.suffix}</span>
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
