"use client";

import Link from "next/link";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
  children
}: PageHeroProps) {
  return (
    <>
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-primary text-white selection:bg-accent/30">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 islamic-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Fade for Navbar transition */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-8 max-w-7xl relative z-10 flex flex-col items-center text-center">
          {/* Badge / Context */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">
              {badge || "Madrasah Portal"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]"
          >
            {title}
          </motion.h1>

          {/* Subtitle & Actions */}
          {(subtitle || children) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 flex flex-col items-center max-w-3xl"
            >
              {subtitle && (
                <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
                  {subtitle}
                </p>
              )}
              {children && (
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  {children}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modern App-Style Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-background border-b border-border/40">
          <div className="container mx-auto px-5 sm:px-8 max-w-7xl py-4">
            <motion.nav 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none"
            >
              <Link href="/" className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 transition-colors hover:bg-primary/10">
                <Home className="w-4 h-4" />
              </Link>

              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />

              <div className="flex items-center gap-2 whitespace-nowrap">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.href ? (
                      <Link href={item.href} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-foreground">
                        {item.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
                    )}
                  </div>
                ))}
              </div>
            </motion.nav>
          </div>
        </div>
      )}
    </>
  );
}
