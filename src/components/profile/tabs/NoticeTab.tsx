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
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-border/40">
        <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 shadow-soft opacity-40">
          <BookMarked className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-black text-foreground mb-2">কোনো নোটিশ পাওয়া যায়নি</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto leading-relaxed">
          বর্তমানে এই মাদ্রাসার পক্ষ থেকে কোনো নতুন নোটিশ বা সংবাদ প্রকাশিত হয়নি।
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
            className="group relative bg-card p-6 rounded-[2rem] border border-border/40 shadow-soft hover:border-primary/20 transition-all active-scale overflow-hidden"
          >
            {/* Type Indicator Dot */}
            <div className={cn(
              "absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2",
              item.type === "NOTICE" ? "bg-accent" : item.type === "NEWS" ? "bg-primary" : "bg-blue-500"
            )} />

            <div className="flex items-center justify-between mb-4">
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

              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase bg-secondary/40 px-3 py-1 rounded-full">
                <Calendar className="w-3 h-3" />
                {toBn(new Date(item.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' }))}
              </div>
            </div>

            <h4 className="text-lg font-black text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h4>

            <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-4 line-clamp-3">
              {item.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
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
      <div className="mt-10 p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-center gap-4 active-scale cursor-pointer">
         <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
            <Bell className="w-6 h-6" />
         </div>
         <div>
            <h4 className="text-sm font-black text-primary">নোটিফিকেশন চালু করুন</h4>
            <p className="text-[11px] font-medium text-muted-foreground">সবশেষ আপডেটগুলো আপনার ফোনে সরাসরি পেতে ক্লিক করুন।</p>
         </div>
      </div>
    </div>
  );
};

export default NoticeTab;
