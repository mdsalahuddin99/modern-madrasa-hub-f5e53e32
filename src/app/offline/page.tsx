"use client";

import Link from "next/link";
import { WifiOff, RefreshCw, Home, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col items-center justify-center p-6 selection:bg-primary/10">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden rounded-[3rem] border border-border/40 bg-card shadow-soft p-8 sm:p-12 text-center"
        >
          {/* Immersive Background Decor */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-accent/10 text-accent mx-auto mb-8 flex items-center justify-center border-4 border-white shadow-sm">
              <WifiOff className="w-12 h-12" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
              সংযোগে সমস্যা হচ্ছে
            </h1>

            <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              আপনার ইন্টারনেট সংযোগ নেই। দয়া করে ওয়াইফাই বা মোবাইল ডেটা চেক করে আবার চেষ্টা করুন।
            </p>

            {/* Offline Checklist Card */}
            <div className="bg-secondary/30 rounded-2xl p-5 mb-10 text-left border border-border/40">
               <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-1">করণীয়সমূহ:</h3>
               <ul className="space-y-3">
                  {[
                    "ওয়াইফাই বা ডাটা চেক করুন",
                    "ফ্লাইট মোড বন্ধ আছে কি না দেখুন",
                    "রাউটারটি পুনরায় চালু করুন"
                  ].map((tip, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-foreground/70">
                       <CheckCircle2 className="w-4 h-4 text-primary" />
                       {tip}
                    </li>
                  ))}
               </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRetry}
                className="h-14 rounded-2xl bg-primary text-white font-black active-scale gap-2 shadow-lg shadow-primary/20 transition-all hover:gap-4"
              >
                <RefreshCw className="w-5 h-5" /> আবার চেষ্টা করুন
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 rounded-2xl border-border/60 bg-white text-foreground font-black active-scale gap-2"
              >
                <Link href="/">
                  <Home className="w-5 h-5" /> হোম পেজে যান
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center space-y-4">
           <div className="flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Offline Mode • Madrasah Portal</span>
           </div>
        </div>
      </div>
    </div>
  );
}
