"use client";

import { Building2, Users, UserCog, ClipboardCheck, CreditCard, TrendingUp, Clock, Sparkles } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { cn, toBn } from "@/lib/utils";
import { motion } from "framer-motion";

const AdminStats = ({ summary: propSummary }: { summary?: any }) => {
  const { summary: ctxSummary } = useAdmin();
  const summary = propSummary || ctxSummary;

  const stats = [
    { label: "মোট মাদ্রাসা", value: summary?.totalMadrasas || 0, icon: Building2, color: "text-primary", bg: "bg-primary/5" },
    { label: "মোট ব্যবহারকারী", value: summary?.totalUsers || 0, icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "পরিচালক", value: summary?.totalDirectors || 0, icon: UserCog, color: "text-primary", bg: "bg-primary/5" },
    { label: "অপেক্ষমাণ অনুমোদন", value: summary?.pendingApprovals || 0, icon: Clock, color: "text-primary", bg: "bg-primary/5" },
    { label: "সক্রিয় সাবস্ক্রিপশন", value: summary?.activeSubscriptions || 0, icon: CreditCard, color: "text-primary", bg: "bg-primary/5" },
    { label: "অপেক্ষমাণ পেমেন্ট", value: summary?.pendingSubscriptions || 0, icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card rounded-[2rem] border border-border/40 shadow-soft p-5 lg:p-8 relative overflow-hidden active-scale group hover:border-primary/20 transition-all"
        >
          <div className={cn("absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20", s.bg)} />

          <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", s.bg)}>
            <s.icon className={cn("w-5 h-5 lg:w-6 lg:h-6", s.color)} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col">
            <div className="text-2xl lg:text-3xl font-black text-foreground tabular-nums tracking-tighter">
              {toBn(s.value)}
            </div>
            <div className="text-[10px] lg:text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">
              {s.label}
            </div>
          </div>

          {s.value > 0 && i < 2 && (
            <div className="absolute bottom-4 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
