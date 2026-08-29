"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Star, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "search", label: "খুঁজুন", icon: Search },
  { id: "categories", label: "ক্যাটাগরি", icon: Grid3X3 },
  { id: "how-it-works", label: "পদ্ধতি", icon: ListOrdered },
  { id: "featured", label: "নির্বাচিত", icon: Star },
] as const;

export function HomeQuickNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const heroEnd = window.innerHeight * 0.85;
      setVisible(window.scrollY > heroEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = window.innerWidth < 1024 ? 72 : 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:top-[4.25rem] lg:bottom-auto px-3 sm:px-6 pb-3 lg:pb-0 safe-bottom pointer-events-none"
          aria-label="দ্রুত নেভিগেশন"
        >
          <div className="container mx-auto lg:max-w-xl">
            <div className="pointer-events-auto flex gap-1 p-1.5 rounded-lg bg-card/95 backdrop-blur-xl border border-border/50 shadow-[0_-4px_24px_hsl(var(--foreground)/0.08)] lg:shadow-lg overflow-x-auto scrollbar-none">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={cn(
                    "flex-1 min-w-[4.25rem] flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 rounded-lg text-[10px] font-semibold transition-all duration-200 touch-target",
                    active === id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
