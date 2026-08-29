import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn, toBn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg?: string;
  delay?: number;
}

export const StatCard = ({ label, value, icon: Icon, color, bg, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-[2rem] p-5 lg:p-6 border border-border/40 shadow-soft relative overflow-hidden active-scale group hover:border-primary/20 transition-all"
    >
      <div className={cn("absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20", bg || "bg-primary/5")} />

      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
          bg || "bg-primary/5"
        )}>
          <Icon className={cn("w-6 h-6", color || "text-primary")} strokeWidth={2.5} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl lg:text-3xl font-black text-foreground tabular-nums tracking-tighter">
              {toBn(value || 0)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
