import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const StatCard = ({ label, value, icon: Icon, color, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-4 border border-border/40"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-foreground">{value || "0"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
