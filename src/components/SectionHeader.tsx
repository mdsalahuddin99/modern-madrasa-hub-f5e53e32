"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  badgeClassName?: string;
}

export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  align = "center",
  className,
  badgeClassName,
}: SectionHeaderProps) {
  const renderTitle = (text: string | React.ReactNode) => {
    if (typeof text !== "string") return text;
    
    const words = text.split(" ");
    if (words.length <= 1) return text;
    
    // Highlight the last 1 or 2 words depending on total length
    const highlightCount = words.length > 3 ? 2 : 1;
    const normalWords = words.slice(0, -highlightCount).join(" ");
    const highlightedWords = words.slice(-highlightCount).join(" ");

    return (
      <>
        {normalWords}{" "}
        <span className="text-primary relative inline-block">
          {highlightedWords}
          <svg className="absolute w-full h-[14px] -bottom-2 left-0 text-primary/70 -z-10" viewBox="0 0 100 15" preserveAspectRatio="none">
            <path d="M3,12 Q50,2 97,10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "mb-10 sm:mb-14",
        align === "center" ? "text-center max-w-2xl mx-auto" : "text-left max-w-xl",
        className,
      )}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={cn(
            "pill-badge mb-4 sm:mb-5",
            badgeClassName ?? "bg-primary/10 text-primary border border-primary/15",
          )}
        >
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
          {badge}
        </motion.div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15] z-10 relative">
        {renderTitle(title)}
      </h2>
      {subtitle && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
