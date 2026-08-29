"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, Map as MapIcon, Star, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "search", label: "সার্চ", icon: Search },
  { id: "categories", label: "ক্যাটাগরি", icon: Grid3X3 },
  { id: "featured", label: "নির্বাচিত", icon: Star },
  { id: "how-it-works", label: "সাহায্য", icon: HelpCircle },
] as const;

export function HomeQuickNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero section
      const heroEnd = window.innerHeight * 0.6;
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
      const offset = 80; // Header offset
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const toBn = (n: number) => n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-2 safe-bottom pointer-events-none lg:hidden"
        >
          <div className="container mx-auto max-w-sm">
            <div className="pointer-events-auto flex items-center justify-around p-2 rounded-[2rem] bg-primary/95 backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary/40">
              {sections.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={cn(
                      "relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active-scale",
                      isActive ? "bg-accent text-white" : "text-white/70"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter mt-1",
                      isActive ? "block" : "hidden"
                    )}>
                      {label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="quickNavActive"
                        className="absolute inset-0 bg-accent rounded-full -z-10 shadow-lg shadow-accent/50"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
