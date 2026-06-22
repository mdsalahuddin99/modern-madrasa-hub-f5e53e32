import { motion } from "framer-motion";
import { Users, GraduationCap, Calendar, Building2 } from "lucide-react";
import { Madrasa } from "@/data/madrasas";
import { useEffect, useState } from "react";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
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
  return <>{count.toLocaleString("bn-BD")}</>;
};

const ProfileStats = ({ madrasa }: { madrasa: Madrasa }) => {
  const stats = [
    { icon: Calendar, label: "প্রতিষ্ঠিত", value: madrasa.established, isAnimated: false },
    { icon: Users, label: "শিক্ষার্থী", value: madrasa.students, suffix: " জন", isAnimated: true },
    { icon: GraduationCap, label: "শিক্ষক", value: madrasa.teachers, suffix: " জন", isAnimated: true },
    { icon: Building2, label: "বোর্ড", value: madrasa.board, isAnimated: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {stats.map((item) => (
        <div
          key={item.label}
          className="float-card bg-card rounded-2xl border border-border/60 p-3.5 md:p-4 text-center"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <item.icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">{item.label}</div>
          <div className="text-sm font-bold text-foreground">
            {item.isAnimated ? (
              <>
                <AnimatedNumber target={item.value as number} />
                {item.suffix}
              </>
            ) : (
              String(item.value)
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default ProfileStats;
