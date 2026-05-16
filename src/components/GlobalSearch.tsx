"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, BadgeCheck, ArrowRight, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { madrasas } from "@/data/madrasas";

interface GlobalSearchProps {
  light?: boolean;
}

const GlobalSearch = ({ light }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return madrasas.slice(0, 5);
    return madrasas.filter(
      (m) =>
        m.name.includes(query) ||
        m.district.includes(query) ||
        m.category.includes(query)
    ).slice(0, 8);
  }, [query]);

  // Reset active index when results change
  useEffect(() => setActiveIndex(0), [results]);

  const handleSelect = useCallback((id: string) => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    router.push(`/madrasas/${id}`);
  }, [router]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Arrow / Enter navigation inside modal
  const handleModalKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect(results[activeIndex].id);
    }
  }, [results, activeIndex, handleSelect]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`hidden lg:flex items-center gap-2 h-9 px-3 rounded-xl text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          light
            ? "bg-white/10 hover:bg-white/15 text-white/80 border border-white/15"
            : "bg-muted/60 hover:bg-muted text-muted-foreground"
        }`}
        aria-label="অনুসন্ধান খুলুন (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span>অনুসন্ধান...</span>
        <kbd className="ml-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-background/80 border border-border/50 text-[10px] font-mono text-muted-foreground">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`lg:hidden p-2.5 rounded-xl transition-colors touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          light ? "text-white hover:bg-white/10" : "text-foreground hover:bg-foreground/5"
        }`}
        aria-label="অনুসন্ধান খুলুন"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="মাদ্রাসা অনুসন্ধান"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKey}
            >
              <div className="bg-card rounded-2xl border border-border/60 shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="মাদ্রাসা, জেলা, বা ক্যাটাগরি অনুসন্ধান..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    aria-label="অনুসন্ধান ইনপুট"
                    role="combobox"
                    aria-expanded="true"
                    aria-activedescendant={results.length > 0 ? `search-item-${activeIndex}` : undefined}
                  />
                  <kbd className="hidden sm:flex px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50 text-[10px] text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
                  {results.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      কোনো মাদ্রাসা পাওয়া যায়নি
                    </div>
                  ) : (
                    results.map((m, i) => (
                      <motion.button
                        key={m.id}
                        id={`search-item-${i}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => handleSelect(m.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left group ${
                          i === activeIndex
                            ? "bg-primary/8 text-foreground"
                            : "hover:bg-muted/50 active:bg-muted/80"
                        }`}
                        role="option"
                        aria-selected={i === activeIndex}
                      >
                        <div className="w-9 h-9 rounded-xl gradient-badge flex items-center justify-center flex-shrink-0">
                          <Search className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-foreground truncate">{m.name}</span>
                            {m.featured && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{m.thana}, {m.district}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border/40 px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>↑↓ নেভিগেট • ↵ নির্বাচন</span>
                  <span>{results.length} টি ফলাফল</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
