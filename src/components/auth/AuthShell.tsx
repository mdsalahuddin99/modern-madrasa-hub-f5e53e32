"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-secondary/30 min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden selection:bg-primary/10"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn("w-full max-w-md relative z-10", className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface AuthIconProps {
  children: React.ReactNode;
  variant?: "default" | "success";
}

export function AuthIcon({ children, variant = "default" }: AuthIconProps) {
  return null;
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-border/60" />
      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">অথবা</span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

export function AuthLoadingFallback() {
  return (
    <div className="bg-secondary/30 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 bg-card rounded-[2rem] flex items-center justify-center shadow-soft animate-pulse">
         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-xs font-black text-primary uppercase tracking-widest">লোড হচ্ছে...</p>
    </div>
  );
}
