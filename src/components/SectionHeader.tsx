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
      <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
