"use client";

import { motion } from "framer-motion";
import { Calendar, Bell, Newspaper, ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, toBn } from "@/lib/utils";

export default function NoticeDetailsClient({ madrasa, notice }: { madrasa: any, notice: any }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link href={`/madrasas/${madrasa.slug}/notices`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors bg-white dark:bg-card/60 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/10 w-fit">
        <ChevronLeft className="w-4 h-4" />
        সকল নোটিশে ফিরে যান
      </Link>

      <div className="bg-white dark:bg-card/60 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
              notice.type === "NOTICE" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
            )}>
              {notice.type === "NOTICE" ? <Bell className="w-5 h-5" /> : <Newspaper className="w-5 h-5" />}
            </div>
            <span className={cn(
              "text-xs font-black uppercase tracking-[0.1em]",
              notice.type === "NOTICE" ? "text-accent" : "text-primary"
            )}>
              {notice.type === "NOTICE" ? "গুরুত্বপূর্ণ নোটিশ" : notice.type === "NEWS" ? "মাদ্রাসা খবর" : "ইভেন্ট আপডেট"}
            </span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-border/60" />

          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-1.5 rounded-full">
            <Calendar className="w-4 h-4" />
            {notice.createdAt ? toBn(new Date(notice.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' })) : "তারিখ নেই"}
          </div>
        </div>

        {/* Notice Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-8 leading-tight relative z-10">
          {notice.title}
        </h1>

        <hr className="border-border/40 mb-8 relative z-10" />

        {/* Notice Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-[15px] prose-p:font-medium relative z-10">
          {notice.content ? (
            <div dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br/>') }} />
          ) : (
            <p className="text-muted-foreground italic">এই নোটিশের বিস্তারিত বিবরণ এখনো দেওয়া হয়নি।</p>
          )}
        </div>

        {/* Attachment (if any) */}
        {notice.attachment && (
           <div className="mt-10 pt-8 border-t border-border/40 relative z-10">
             <h4 className="text-sm font-bold text-foreground mb-4">সংযুক্ত ফাইলসমূহ</h4>
             <a href={notice.attachment} target="_blank" rel="noopener noreferrer">
               <Button variant="outline" className="gap-2 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                 <Download className="w-4 h-4" />
                 ফাইল ডাউনলোড করুন
               </Button>
             </a>
           </div>
        )}
      </div>
    </div>
  );
}
