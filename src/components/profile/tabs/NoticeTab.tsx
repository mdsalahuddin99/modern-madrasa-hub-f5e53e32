"use client";

import { motion } from "framer-motion";
import { BookMarked, Calendar, Bell, Newspaper, Sparkles, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, toBn } from "@/lib/utils";

interface NoticeTabProps {
  contents?: any[];
}

const NoticeTab = ({ contents }: NoticeTabProps) => {
  if (!contents || contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="w-24 h-24 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/10 relative z-10">
          <BookMarked className="w-10 h-10 text-primary/60" />
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3 relative z-10">কোনো নোটিশ পাওয়া যায়নি</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-sm mx-auto leading-relaxed relative z-10">
          বর্তমানে এই মাদ্রাসার পক্ষ থেকে কোনো নতুন নোটিশ বা সংবাদ প্রকাশিত হয়নি। নিয়মিত আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-2">
         <h3 className="text-xl font-black text-foreground flex items-center gap-3">
            <div className="w-1.5 h-6 bg-accent rounded-full" />
            নোটিশ ও সংবাদ
         </h3>
         <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-tighter">
            মোট {toBn(contents.length)}টি
         </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contents.map((item: any, i: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group relative bg-white dark:bg-card/60 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-white/10 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Type Indicator Dot */}
            <div className={cn(
              "absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2",
              item.type === "NOTICE" ? "bg-accent" : item.type === "NEWS" ? "bg-primary" : "bg-blue-500"
            )} />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shadow-sm",
                  item.type === "NOTICE" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                )}>
                  {item.type === "NOTICE" ? <Bell className="w-4 h-4" /> : <Newspaper className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.1em]",
                  item.type === "NOTICE" ? "text-accent" : "text-primary"
                )}>
                  {item.type === "NOTICE" ? "গুরুত্বপূর্ণ নোটিশ" : item.type === "NEWS" ? "মাদ্রাসা খবর" : "ইভেন্ট আপডেট"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                {toBn(new Date(item.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' }))}
              </div>
            </div>

            <h4 className="text-base sm:text-lg font-black text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h4>

            <div className="flex items-center justify-between pt-3 border-t border-border/40">
               <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  বিস্তারিত পড়ুন <ChevronRight className="w-3.5 h-3.5" />
               </button>
               {i === 0 && (
                 <div className="flex items-center gap-1 text-[9px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded-md animate-pulse">
                    <Sparkles className="w-3 h-3" /> নতুন
                 </div>
               )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subscription Callout in Notices */}
      <div className="mt-10 p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-white dark:via-card/60 to-primary/5 border border-primary/20 shadow-lg flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group">
         <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Bell className="w-7 h-7" />
         </div>
         <div>
            <h4 className="text-lg font-black text-primary mb-1">নোটিফিকেশন চালু করুন</h4>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">সবশেষ আপডেটগুলো আপনার ফোনে সরাসরি পেতে ক্লিক করুন</p>
         </div>
      </div>
    </div>
  );
};

export default NoticeTab;

