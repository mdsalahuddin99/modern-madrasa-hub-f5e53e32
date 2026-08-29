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
    
    // Industrial minimalist style: No playful underlines, just bold primary accent
    const highlightCount = words.length > 3 ? 2 : 1;
    const normalWords = words.slice(0, -highlightCount).join(" ");
    const highlightedWords = words.slice(-highlightCount).join(" ");

    return (
      <>
        {normalWords}{" "}
        <span className="text-primary border-b-4 border-primary/20 pb-1">
          {highlightedWords}
        </span>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "mb-12 lg:mb-20",
        align === "center" ? "text-center max-w-4xl mx-auto" : "text-left max-w-2xl",
        className,
      )}
    >
      {badge && (
        <div className={cn("flex mb-6", align === "center" ? "justify-center" : "justify-start")}>
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary border border-border rounded-sm text-[10px] font-black uppercase tracking-[0.2em]",
              badgeClassName,
            )}
          >
            {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
            {badge}
          </div>
        </div>
      )}

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tighter leading-[1.1] mb-6">
        {renderTitle(title)}
      </h2>

      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium opacity-80 max-w-2xl mx-auto lg:mx-0">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
