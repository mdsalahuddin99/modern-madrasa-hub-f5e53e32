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
      className="auth-page-bg min-h-screen flex flex-col items-center justify-center px-4 py-10 safe-bottom"
    >
      <Link
        href="/"
        className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 flex items-center gap-2.5 group safe-top"
        aria-label="হোমপেজে ফিরে যান"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </motion.div>
        <span className="text-sm font-bold text-foreground tracking-tight hidden sm:inline group-hover:text-primary transition-colors">
          কওমি মাদ্রাসা ডিরেক্টরি
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn("w-full max-w-md", className)}
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
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg",
        variant === "default" && "gradient-btn shadow-primary/25",
        variant === "success" && "bg-primary/10 shadow-primary/10",
      )}
    >
      {children}
    </motion.div>
  );
}

export function AuthDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-4"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent origin-left"
      />
      <span className="text-xs text-muted-foreground font-medium">অথবা</span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent origin-right"
      />
    </motion.div>
  );
}

export function AuthLoadingFallback() {
  return (
    <div className="auth-page-bg min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-bengali">অপেক্ষা করুন...</p>
      </div>
    </div>
  );
}
