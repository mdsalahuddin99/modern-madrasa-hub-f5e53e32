"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, BadgeCheck, ArrowRight, Command, X, Sparkles, TrendingUp, History } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface GlobalSearchProps {
  light?: boolean;
}

const popularSearches = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "হিফজ", "জামিয়া"];

const GlobalSearch = ({ light }: GlobalSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const endpoint = debouncedQuery.trim() 
    ? `/api/madrasas?search=${encodeURIComponent(debouncedQuery)}&limit=8`
    : `/api/madrasas?limit=5`;

  const { data } = useSWR(isOpen ? endpoint : null, fetcher, { keepPreviousData: true });
  
  const results = useMemo(() => {
    if (data?.madrasas) return data.madrasas;
    return [];
  }, [data]);

  useEffect(() => setActiveIndex(0), [results]);

  const handleSelect = useCallback((id: string) => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    router.push(`/madrasas/${id}`);
  }, [router]);

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const toBn = (n: number) => n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "hidden lg:flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold transition-all active-scale",
          light
            ? "bg-white/10 hover:bg-white/20 text-white/90 border border-white/20"
            : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-muted-foreground border border-slate-200 dark:border-white/10"
        )}
      >
        <Search className="w-4 h-4" />
        <span>অনুসন্ধান করুন...</span>
        <kbd className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 shadow-sm text-[10px] font-mono">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all active-scale",
          light ? "text-white hover:bg-white/10" : "text-foreground bg-secondary/50"
        )}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Full-screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl flex flex-col pt-[env(safe-area-inset-top)]"
            role="dialog"
            aria-modal="true"
          >
            {/* Search Header */}
            <div className="px-5 py-4 flex items-center gap-3 border-b border-border/40">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleModalKey}
                  placeholder="মাদ্রাসা বা জেলা খুঁজুন..."
                  className="w-full h-12 pl-12 pr-10 rounded-2xl bg-secondary/30 text-base font-bold placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/20"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground active-scale"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm font-black text-primary uppercase active-scale px-2"
              >
                বন্ধ
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {!query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" />
                      জনপ্রিয় অনুসন্ধান
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-xl bg-secondary/50 text-xs font-bold text-foreground border border-border/40 active-scale"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features / Quick Tips */}
                  <div className="p-5 rounded-[2rem] bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-primary">স্মার্ট সার্চ টিপস</h4>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      আপনি সরাসরি মাদ্রাসার নাম, ক্যাটাগরি অথবা জেলার নাম লিখে সার্চ করতে পারেন। সঠিক ফলাফল পেতে কি-ওয়ার্ড ব্যবহার করুন।
                    </p>
                  </div>
                </motion.div>
              )}

              {query && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">অনুসন্ধানের ফলাফল ({toBn(results.length)})</p>
                    {data && !data.madrasas && <Loader className="w-4 h-4 animate-spin text-primary" />}
                  </div>

                  {results.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto opacity-50">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">কোনো ফলাফল পাওয়া যায়নি</p>
                    </div>
                  ) : (
                    results.map((m: any, i: number) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect(m.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left active-scale group border",
                          i === activeIndex
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-card border-border/40"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          i === activeIndex ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                        )}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black truncate">{m.name}</span>
                            {m.featured && <BadgeCheck className="w-4 h-4 fill-accent text-white" />}
                          </div>
                          <p className={cn(
                            "text-[10px] font-bold uppercase mt-0.5",
                            i === activeIndex ? "text-white/70" : "text-muted-foreground"
                          )}>
                            {m.thana}, {m.district}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Search Footer for Desktop */}
            <div className="hidden lg:flex px-6 py-3 border-t border-border/40 bg-secondary/20 items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
               <div className="flex gap-4">
                  <span>↑↓ নেভিগেট</span>
                  <span>↵ নির্বাচন</span>
                  <span>ESC বন্ধ</span>
               </div>
               <span className="text-primary">{toBn(results.length)} টি ফলাফল</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Loader = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default GlobalSearch;
