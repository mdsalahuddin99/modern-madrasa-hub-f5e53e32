"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col items-center justify-center p-6 selection:bg-primary/10">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden rounded-[3rem] border border-border/40 bg-card shadow-soft p-8 sm:p-12 text-center"
        >
          {/* Immersive Background Decor */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 islamic-pattern opacity-[0.02] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-destructive/10 text-destructive mx-auto mb-8 flex items-center justify-center border-4 border-white shadow-sm">
              <AlertTriangle className="w-12 h-12" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
              দুঃখিত, সমস্যা হয়েছে!
            </h1>
            
            <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              সিস্টেমে সাময়িক ত্রুটি দেখা দিয়েছে। আমরা ইতিমধ্যে এটি সমাধানের কাজ শুরু করেছি।
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={reset} 
                className="h-14 rounded-2xl bg-primary text-white font-black active-scale gap-2 shadow-lg shadow-primary/20 transition-all hover:gap-4"
              >
                <RotateCcw className="w-5 h-5" /> আবার চেষ্টা করুন
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

            <div className="mt-12 pt-8 border-t border-border/40">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">
                সরাসরি সহায়তার জন্য
              </p>
              <Button asChild variant="ghost" className="text-primary font-black gap-2 active-scale h-auto py-2 px-4 rounded-xl hover:bg-primary/5">
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4" /> সাপোর্ট টিম
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-30">
          System Recovery Mode • Madrasah Portal
        </p>
      </div>
    </div>
  );
}
