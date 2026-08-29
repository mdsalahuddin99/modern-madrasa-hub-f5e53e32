"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Search, MapPin, Users, Calendar, ArrowUpRight, X, SlidersHorizontal, Loader2, Layers, CheckCircle2, Filter } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { categories } from "@/data/madrasas";
import { LocationSelector } from "@/components/ui/location-selector";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn, toBn } from "@/lib/utils";

interface Madrasa {
  id: string;
  slug: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  established: string | null;
  students: number;
  image: string | null;
  description: string | null;
  rating: number;
  featured: boolean;
}

interface MadrasaListClientProps {
  initialData: {
    madrasas: Madrasa[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const boards = [
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা",
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ",
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ",
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ",
];

function MadrasaCard({ madrasa }: { madrasa: Madrasa }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-[2rem] p-4 md:p-5 shadow-xl shadow-black/5 border border-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
    >
      <Link href={`/madrasas/${madrasa.slug || madrasa.id}`} className="flex flex-col flex-1 h-full">
        {/* Soft Image Frame */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAFAFA] mb-5 shrink-0">
          {madrasa.image ? (
            <Image
              src={madrasa.image}
              alt={madrasa.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-5xl text-primary/10">
              {madrasa.name.slice(0, 1)}
            </div>
          )}

          {/* Category Pill */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full font-bold text-xs shadow-sm">
            {madrasa.category}
          </div>

          {/* Featured Star */}
          {madrasa.featured && (
            <div className="absolute top-4 right-4 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30">
              <StarIcon className="w-4 h-4 fill-current" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="px-2 flex flex-col flex-1">
          <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] mb-3">
            {madrasa.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
            <span className="truncate">{madrasa.district}, {madrasa.division}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.75rem] mb-0">
            {madrasa.description || `${madrasa.name} - ${madrasa.category} বিভাগের একটি স্বনামধন্য কওমি মাদ্রাসা।`}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-black/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                   <Users className="w-4 h-4 text-primary" />
                 </div>
                 <div>
                   <div className="text-[10px] text-muted-foreground font-bold">শিক্ষার্থী</div>
                   <div className="text-sm font-bold tabular-nums leading-none mt-0.5">{toBn(madrasa.students)}</div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                   <Calendar className="w-4 h-4 text-primary" />
                 </div>
                 <div>
                   <div className="text-[10px] text-muted-foreground font-bold">স্থাপিত</div>
                   <div className="text-sm font-bold tabular-nums leading-none mt-0.5">{toBn(madrasa.established || "—")}</div>
                 </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="w-10 h-10 rounded-full bg-primary shadow-sm shadow-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/40 transition-all shrink-0">
               <ArrowUpRight className="w-4 h-4 text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function MadrasaListClient({ initialData }: MadrasaListClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams?.get("search") || "");
  const [divisionId, setDivisionId] = useState<string>(searchParams?.get("divisionId") || "");
  const [districtId, setDistrictId] = useState<string>(searchParams?.get("districtId") || "");
  const [thanaId, setThanaId] = useState<string>(searchParams?.get("thanaId") || "");
  const [category, setCategory] = useState<string>(searchParams?.get("category") || "all");
  const [board, setBoard] = useState<string>(searchParams?.get("board") || "all");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [divisions, setDivisions] = useState<{id: string, nameBn: string}[]>([]);

  useEffect(() => {
    fetch("/api/locations?type=divisions")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setDivisions(json.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.set("search", debouncedSearch);
  if (divisionId) queryParams.set("divisionId", divisionId);
  if (districtId) queryParams.set("districtId", districtId);
  if (thanaId) queryParams.set("thanaId", thanaId);
  if (category && category !== "all") queryParams.set("category", category);
  if (board && board !== "all") queryParams.set("board", board);
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  const { data, isLoading } = useSWR(
    `/api/madrasas?${queryParams.toString()}`,
    {
      fallbackData: queryParams.toString() === `page=1&limit=${limit}` ? initialData : undefined,
      keepPreviousData: true,
    }
  );

  const madrasas = data?.madrasas || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0, page: 1 };

  const clearFilters = () => {
    setSearch("");
    setDivisionId("");
    setDistrictId("");
    setThanaId("");
    setCategory("all");
    setBoard("all");
    setPage(1);
  };

  const activeFilterCount = [divisionId, districtId, category !== "all", board !== "all"].filter(Boolean).length;

  const FilterPanel = ({ isDesktop = false }: { isDesktop?: boolean }) => (
    <div className={cn("space-y-6", isDesktop && "flex flex-wrap items-end gap-4 space-y-0")}>
      <div className={cn("space-y-3", isDesktop && "flex-[0.7] min-w-[150px] space-y-2")}>
        <p className="text-xs font-bold text-muted-foreground ml-1">লোকেশন ফিল্টার</p>
        <div className={cn("grid grid-cols-1 gap-3", isDesktop && "grid-cols-2 gap-2")}>
          <LocationSelector
            className="contents"
            divisionId={divisionId}
            onDivisionChange={(id) => { setDivisionId(id); setDistrictId(""); setThanaId(""); setPage(1); }}
            districtId={districtId}
            onDistrictChange={(id) => { setDistrictId(id); setThanaId(""); setPage(1); }}
            thanaId={thanaId}
            onThanaChange={(id) => { setThanaId(id); setPage(1); }}
            hideDivisionOnDesktop={isDesktop}
          />
        </div>
      </div>

      <div className={cn("space-y-3", isDesktop && "flex-[0.8] min-w-[180px] space-y-2")}>
        <p className="text-xs font-bold text-muted-foreground ml-1">ক্যাটাগরি ও বোর্ড</p>
        <div className={cn("grid grid-cols-1 gap-3", isDesktop && "grid-cols-2 gap-2")}>
          <Select value={category || "all"} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-lg border-border/40 bg-background/70 font-medium text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 active-scale">
              <SelectValue placeholder="সব ক্যাটাগরি" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all" className="font-medium">সব ক্যাটাগরি</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c} className="font-medium">{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={board || "all"} onValueChange={setBoard}>
            <SelectTrigger className="h-12 rounded-lg border-border/40 bg-background/70 font-medium text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 active-scale">
              <SelectValue placeholder="সব বোর্ড" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="all" className="font-medium">সব বোর্ড</SelectItem>
              {boards.map((b) => <SelectItem key={b} value={b} className="font-medium">{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button onClick={clearFilters} variant="ghost" className={cn("text-destructive font-bold active-scale h-12 rounded-xl", isDesktop && "px-4")}>
          <X className="w-4 h-4 mr-2" /> ক্লিয়ার
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-5 py-8 lg:py-12 max-w-7xl">

      {/* Header Action Bar */}
      <div className="flex flex-col gap-6 mb-12 lg:mb-16">
        
        {/* Title Section */}
        <div className="text-center lg:text-left mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">আপনার কাঙ্ক্ষিত মাদ্রাসাটি খুঁজুন</h2>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-2xl">
            মাদ্রাসার নাম, ঠিকানা, বিভাগ অথবা যেকোনো কি-ওয়ার্ড দিয়ে বাংলাদেশের সর্ববৃহৎ কওমি মাদ্রাসা ডিরেক্টরি থেকে খুব সহজেই সার্চ করুন।
          </p>
        </div>

        <div className="relative w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="মাদ্রাসার নাম, ঠিকানা বা বিবরণ দিয়ে খুঁজুন..."
            className="h-14 lg:h-16 pl-14 pr-6 rounded-full border-black/5 bg-white shadow-sm text-base font-medium placeholder:text-muted-foreground/60 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Desktop Division Pills */}
        <div className="hidden lg:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setDivisionId(""); setDistrictId(""); setThanaId(""); setPage(1); }}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all active-scale border",
              !divisionId 
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                : "bg-white text-foreground border-border/40 hover:bg-secondary/50"
            )}
          >
            সব বিভাগ
          </button>
          {divisions.map((div) => (
            <button
              key={div.id}
              onClick={() => { setDivisionId(div.id); setDistrictId(""); setThanaId(""); setPage(1); }}
              className={cn(
                "whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all active-scale border",
                divisionId === div.id 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                  : "bg-white text-foreground border-border/40 hover:bg-secondary/50"
              )}
            >
              {div.nameBn}
            </button>
          ))}
        </div>

        {/* Native Bottom Sheet for Mobile */}
        <div className="lg:hidden w-full sm:w-auto">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="h-14 w-full sm:w-14 rounded-2xl bg-white border border-black/5 text-foreground shadow-sm active-scale gap-3 hover:bg-primary/5">
                <Filter className="w-5 h-5 text-primary" />
                <span className="sm:hidden font-bold">ফিল্টার করুন</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-1 w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-background shadow-sm">
                    {toBn(activeFilterCount)}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-6 pb-12 bg-background border-none rounded-t-[3rem]">
              <DrawerHeader className="px-0 mb-6">
                <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto mb-6" />
                <DrawerTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <SlidersHorizontal className="w-6 h-6 text-primary" /> ফিল্টার করুন
                </DrawerTitle>
                <DrawerDescription className="text-left font-medium text-muted-foreground mt-1">আপনার প্রয়োজনীয় মাদ্রাসাটি দ্রুত খুঁজে নিন</DrawerDescription>
              </DrawerHeader>
              <FilterPanel />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Inline Desktop Filters */}
        <div className="hidden lg:block w-full bg-white p-5 rounded-3xl border border-black/5 shadow-sm">
           <FilterPanel isDesktop />
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-6 bg-primary rounded-full shadow-sm" />
           <div>
              <p className="text-lg font-bold text-foreground tracking-tight">
                মোট <span className="text-primary tabular-nums">{toBn(pagination.total)}</span>টি মাদ্রাসা পাওয়া গেছে
              </p>
              {activeFilterCount > 0 && <p className="text-xs font-medium text-primary mt-0.5">ফিল্টার অ্যাপ্লাই করা হয়েছে</p>}
           </div>
        </div>
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
      </div>

      {madrasas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-24">
            <AnimatePresence mode="popLayout">
              {madrasas.map((madrasa: Madrasa) => (
                <MadrasaCard key={madrasa.id} madrasa={madrasa} />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-12 border-t border-black/5">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-black/10 font-bold active-scale px-6 group transition-all"
                disabled={pagination.page <= 1}
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                আগেরটি
              </Button>
              <div className="h-12 px-6 bg-primary/5 rounded-xl flex items-center justify-center font-bold text-primary text-sm shadow-sm tabular-nums">
                {toBn(pagination.page)} / {toBn(pagination.totalPages)}
              </div>
              <Button
                variant="outline"
                className="h-12 rounded-xl border-black/10 font-bold active-scale px-6 group transition-all"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => { setPage(p => Math.min(pagination.totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                পরবর্তী
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 lg:py-32 bg-white rounded-3xl border border-black/5 shadow-sm">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search className="w-10 h-10 text-primary/40" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">কোনো মাদ্রাসা পাওয়া যায়নি</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm font-medium mb-8 leading-relaxed">
            আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          <Button className="rounded-xl h-12 px-8 font-bold active-scale bg-primary text-white shadow-sm" onClick={clearFilters}>
            সব ফিল্টার মুছে ফেলুন
          </Button>
        </div>
      )}
    </div>
  );
}
