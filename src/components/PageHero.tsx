"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
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
    <>
      <section className="relative pt-20 pb-8 md:pt-24 md:pb-10 overflow-hidden bg-[#0a6631] flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px]">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 z-0 islamic-pattern opacity-10 pointer-events-none" />
        
        {/* Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a6631] via-transparent to-[#0a6631] z-0 mix-blend-multiply opacity-50" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-0" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle & Children (Kept for compatibility with other pages) */}
          {(subtitle || children || badge) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 flex flex-col items-center"
            >
              {badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm mb-4">
                  {badge}
                </span>
              )}
              {subtitle && (
                <p className="text-white/80 text-sm md:text-base max-w-2xl">{subtitle}</p>
              )}
              {children && (
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {children}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Breadcrumbs Outside Section */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <motion.nav 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm"
            >
              <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <div className="flex items-center gap-2 flex-wrap">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.href ? (
                      <Link href={item.href} className="hover:text-foreground transition-colors font-medium">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-foreground font-bold">{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
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
