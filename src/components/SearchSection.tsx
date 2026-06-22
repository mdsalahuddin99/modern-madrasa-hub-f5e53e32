"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  MapPin,
  Building2,
  Layers,
  X,
  Loader2,
  TrendingUp,
  School,
  BookOpen,
  BookMarked,
  Users,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { divisions, districtsByDivision, categories } from "@/data/madrasas";
import { thanasByDistrict } from "@/data/thanas";
import { useSiteContent } from "@/hooks/useSiteContent";

const quickCategories = [
  { name: "জামিয়া", icon: BookOpen, color: "from-emerald-deep to-primary", bg: "bg-emerald-deep/10", text: "text-emerald-deep", border: "border-emerald-deep/20 hover:border-emerald-deep/40" },
  { name: "হিফজুল কুরআন", icon: BookMarked, color: "from-gold to-accent", bg: "bg-gold/10", text: "text-gold", border: "border-gold/20 hover:border-gold/40" },
  { name: "আলিয়া", icon: School, color: "from-primary to-emerald-deep", bg: "bg-primary/10", text: "text-primary", border: "border-primary/20 hover:border-primary/40" },
  { name: "নূরানী", icon: GraduationCap, color: "from-accent to-gold", bg: "bg-accent/10", text: "text-accent", border: "border-accent/20 hover:border-accent/40" },
  { name: "মহিলা", icon: Users, color: "from-emerald-deep to-gold", bg: "bg-emerald-deep/10", text: "text-emerald-deep", border: "border-emerald-deep/20 hover:border-emerald-deep/40" },
];

const popularSearches = [
  "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল",
];

const SearchSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const districts = selectedDivision
    ? districtsByDivision[selectedDivision] || []
    : [];
  const thanas = selectedDistrict
    ? thanasByDistrict[selectedDistrict] || []
    : [];
  const { content } = useSiteContent();
  const s = content.search;

  useEffect(() => {
    if (showQuickFilters && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showQuickFilters]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (searchQuery.trim())
      chips.push({
        key: "q",
        label: `"${searchQuery.trim()}"`,
        clear: () => setSearchQuery(""),
      });
    if (selectedDivision)
      chips.push({
        key: "div",
        label: selectedDivision,
        clear: () => {
          setSelectedDivision("");
          setSelectedDistrict("");
          setSelectedThana("");
        },
      });
    if (selectedDistrict)
      chips.push({
        key: "dist",
        label: selectedDistrict,
        clear: () => {
          setSelectedDistrict("");
          setSelectedThana("");
        },
      });
    if (selectedThana)
      chips.push({
        key: "thana",
        label: selectedThana,
        clear: () => setSelectedThana(""),
      });
    if (selectedCategory)
      chips.push({
        key: "cat",
        label: selectedCategory,
        clear: () => setSelectedCategory(""),
      });
    return chips;
  }, [searchQuery, selectedDivision, selectedDistrict, selectedThana, selectedCategory]);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedThana("");
    setSelectedCategory("");
  };

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedDivision) params.set("division", selectedDivision);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedThana) params.set("thana", selectedThana);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/madrasas?${params.toString()}`);
  };

  const handleQuickCategory = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? "" : cat);
    setShowQuickFilters(true);
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setShowQuickFilters(true);
    setTimeout(() => handleSearch(), 300);
  };

  const totalFilters = activeFilters.length;

  return (
    <section id="search" className="section-padding pt-6 sm:pt-12 pb-10 sm:pb-20 scroll-mt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-emerald-deep/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        {/* ─── Header with badge ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-deep/10 text-emerald-deep border border-emerald-deep/15 mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-semibold">{s.badge}</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight leading-[1.15]">
            {s.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {s.subtitle}
          </p>
        </motion.div>

        {/* ─── Quick Category Pills (Social Proof + Category Heuristics) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2.5 mb-6 sm:mb-8"
        >
          {quickCategories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.35 }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickCategory(cat.name)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                  isActive
                    ? `${cat.bg} ${cat.text} border-current shadow-md`
                    : "bg-card text-muted-foreground border-border/40 hover:border-border/70 hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "" : "text-muted-foreground/60"}`} />
                {cat.name}
                {isActive && (
                  <X className="w-3 h-3 ml-0.5" />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ─── Main Search Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-card to-card/95 border-2 border-border/20 shadow-[0_24px_80px_hsl(var(--foreground)/0.06)]">
            {/* Decorative elements */}
            <div className="absolute inset-0 islamic-pattern opacity-[0.05] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-deep via-gold to-accent" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-deep/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gold/4 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative p-5 sm:p-8 md:p-10 space-y-5">
              {/* ─── Search Input ─── */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-deep/20 via-gold/10 to-accent/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                <div className="relative flex items-center">
                  <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-deep to-primary flex items-center justify-center pointer-events-none shadow-lg shadow-emerald-deep/20">
                    <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <Input
                    ref={searchInputRef}
                    placeholder="মাদ্রাসার নাম লিখুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 sm:h-16 pl-16 sm:pl-18 pr-14 rounded-2xl border-2 border-border/40 bg-background/80 text-sm sm:text-base shadow-sm focus:border-emerald-deep/30 focus:ring-4 focus:ring-emerald-deep/10 transition-all placeholder:text-muted-foreground/50"
                    aria-label="মাদ্রাসার নাম"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-target"
                      aria-label="মুছুন"
                    >
                      <X className="w-4.5 h-4.5" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* ─── Quick Filters Toggle ─── */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowQuickFilters(!showQuickFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    showQuickFilters
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-muted/50 text-muted-foreground border border-border/30 hover:border-border/60"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  উন্নত ফিল্টার
                  {totalFilters > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold min-w-[18px] text-center">
                      {totalFilters}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${showQuickFilters ? "rotate-90" : ""}`} />
                </button>

                {/* Popular searches */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">জনপ্রিয়:</span>
                  {popularSearches.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handlePopularSearch(term)}
                      className="text-[10px] sm:text-xs font-medium text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-primary/5 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Advanced Filters Panel ─── */}
              <motion.div
                initial={false}
                animate={{
                  height: showQuickFilters ? "auto" : 0,
                  opacity: showQuickFilters ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="pt-1 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    <Select
                      value={selectedDivision}
                      onValueChange={(v) => {
                        setSelectedDivision(v);
                        setSelectedDistrict("");
                        setSelectedThana("");
                      }}
                    >
                      <SelectTrigger
                        className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                        aria-label="বিভাগ"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="বিভাগ নির্বাচন" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {divisions.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedDistrict}
                      onValueChange={(v) => {
                        setSelectedDistrict(v);
                        setSelectedThana("");
                      }}
                      disabled={!selectedDivision}
                    >
                      <SelectTrigger
                        className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm disabled:opacity-40 transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                        aria-label="জেলা"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            selectedDivision ? "জেলা নির্বাচন" : "আগে বিভাগ বাছুন"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedThana}
                      onValueChange={setSelectedThana}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger
                        className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm disabled:opacity-40 transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                        aria-label="থানা"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue
                          placeholder={
                            selectedDistrict
                              ? "থানা/উপজেলা"
                              : "আগে জেলা বাছুন"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl max-h-60">
                        {thanas.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger
                        className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                        aria-label="ক্যাটাগরি"
                      >
                        <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="ক্যাটাগরি" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active filter chips */}
                  {activeFilters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap items-center gap-2"
                    >
                      {activeFilters.map((f) => (
                        <motion.button
                          key={f.key}
                          type="button"
                          onClick={f.clear}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-emerald-deep/8 text-emerald-deep border border-emerald-deep/15 hover:bg-emerald-deep/12 active:scale-95 transition-all"
                        >
                          {f.label}
                          <X className="w-3 h-3" />
                        </motion.button>
                      ))}
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-xs font-medium text-muted-foreground hover:text-destructive px-2 py-2 transition-colors"
                      >
                        সব মুছুন
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* ─── Bottom: Features + CTA ─── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                {/* Feature items */}
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {[
                    { icon: MapPin, text: "বিভাগ, জেলা, থানা" },
                    { icon: Building2, text: "সকল ধরনের মাদ্রাসা" },
                    { icon: Zap, text: "তাৎক্ষণিক ফলাফল" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-background/60 border border-border/20"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-deep/8 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-emerald-deep" />
                      </div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight hidden sm:block">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Search button */}
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-13 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-bold gradient-btn shimmer-btn text-primary-foreground shadow-xl shadow-primary/15 hover:shadow-[0_16px_48px_hsl(var(--primary)/0.25)] transition-all duration-500 gap-2.5 shrink-0 group"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      খুঁজছি...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
                      {s.buttonText}
                      <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </div>

              {/* ─── Trust Line ─── */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-1 border-t border-border/20"
              >
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-emerald-deep" />
                  <span>৫০০+ নিবন্ধিত মাদ্রাসা</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-gold" />
                  <span>৬৪ জেলায় বিস্তৃত</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span>বিনামূল্যে অনুসন্ধান</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span>প্রতি সপ্তাহে ১২+ নতুন</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
