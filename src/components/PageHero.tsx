"use client";

import Link from "next/link";
import { ChevronRight, Home, Plane } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string; // Kept for compatibility, though not shown in screenshot
  badge?: string; // Kept for compatibility
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode; // Kept for compatibility
}

export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
  children
}: PageHeroProps) {
  return (
    <section className="relative pt-16 pb-10 md:pt-20 md:pb-12 overflow-hidden bg-[#0a6631] flex flex-col items-center justify-center min-h-[150px] md:min-h-[180px]">
      {/* Plus Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 16v8m-4-4h8' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Subtle Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a6631] via-transparent to-[#0a6631] z-0 mix-blend-multiply opacity-50" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-0" />

      {/* Decorative Watermark Icons (Left) */}
      <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03]">
        <Plane className="w-48 h-48 text-white -rotate-45" />
        <Plane className="w-24 h-24 text-white -rotate-45 absolute -bottom-10 -left-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Breadcrumbs Pill */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-white/90 text-sm md:text-base bg-black/20 px-6 py-2.5 rounded-full backdrop-blur-sm border border-white/5"
          >
            <Home className="w-4 h-4 text-white/80" />
            <div className="flex items-center gap-2">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#fecb00] font-medium">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        )}

        {/* Subtitle & Children (Kept for compatibility with other pages) */}
        {(subtitle || children || badge) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center"
          >
            {badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm mb-4">
                {badge}
              </span>
            )}
            {subtitle && (
              <p className="text-white/80 text-lg max-w-2xl mb-6">{subtitle}</p>
            )}
            {children && (
              <div className="flex flex-wrap gap-4 justify-center">
                {children}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
