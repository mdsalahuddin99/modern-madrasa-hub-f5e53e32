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
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden active-scale group h-full flex flex-col"
    >
      <Link href={`/madrasas/${madrasa.slug}`} className="flex-1 flex flex-col">
        <div className="aspect-[16/10] relative overflow-hidden bg-secondary/20">
          {madrasa.image ? (
            <Image 
              src={madrasa.image} 
              alt={madrasa.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-primary/20 font-black text-4xl uppercase">
              {madrasa.name.slice(0, 1)}
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-white border-none backdrop-blur-md text-[10px] font-black uppercase px-3 py-1">
              {madrasa.category}
            </Badge>
          </div>
          {madrasa.featured && (
            <div className="absolute top-4 right-4 w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20">
              <StarIcon className="w-4.5 h-4.5 fill-current" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded-md line-clamp-1">{madrasa.board}</span>
          </div>
          <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
            {madrasa.name}
          </h3>
          
          <div className="space-y-4 mt-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="line-clamp-1 uppercase tracking-widest">{madrasa.thana}, {madrasa.district}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-5">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">শিক্ষার্থী</span>
                  <span className="text-sm font-black text-foreground tabular-nums">{toBn(madrasa.students)}</span>
                </div>
                <div className="w-px h-8 bg-border/60" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">স্থাপিত</span>
                  <span className="text-sm font-black text-foreground tabular-nums">{toBn(madrasa.established || "—")}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ArrowUpRight className="w-5.5 h-5.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
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
      <div className={cn("space-y-3", isDesktop && "flex-1 min-w-[200px] space-y-2")}>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">লোকেশন ফিল্টার</p>
        <div className={cn("grid grid-cols-1 gap-3", isDesktop && "grid-cols-3 gap-2")}>
          <LocationSelector
            className="contents"
            divisionId={divisionId}
            onDivisionChange={setDivisionId}
            districtId={districtId}
            onDistrictChange={setDistrictId}
            thanaId={thanaId}
            onThanaChange={setThanaId}
          />
        </div>
      </div>

      <div className={cn("space-y-3", isDesktop && "flex-[0.8] min-w-[180px] space-y-2")}>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">ক্যাটাগরি ও বোর্ড</p>
        <div className={cn("grid grid-cols-1 gap-3", isDesktop && "grid-cols-2 gap-2")}>
          <Select value={category || "all"} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary/30 font-bold border-none active-scale">
              <SelectValue placeholder="সব ক্যাটাগরি" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="font-bold">সব ক্যাটাগরি</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={board || "all"} onValueChange={setBoard}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary/30 font-bold border-none active-scale">
              <SelectValue placeholder="সব বোর্ড" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all" className="font-bold">সব বোর্ড</SelectItem>
              {boards.map((b) => <SelectItem key={b} value={b} className="font-bold">{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button onClick={clearFilters} variant="ghost" className={cn("text-destructive font-black active-scale h-12 rounded-xl", isDesktop && "px-4")}>
          <X className="w-4 h-4 mr-2" /> ক্লিয়ার
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-5 py-8 lg:py-16 max-w-7xl">

      {/* Mobile & Desktop Header Action Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-12 lg:mb-16">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="মাদ্রাসার নাম, ঠিকানা বা বিবরণ দিয়ে খুঁজুন..."
            className="h-14 lg:h-16 pl-14 pr-6 rounded-[1.5rem] lg:rounded-[2rem] border-none bg-card shadow-soft text-base lg:text-lg font-black placeholder:text-muted-foreground/40 focus-visible:ring-4 focus-visible:ring-primary/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Native Bottom Sheet for Mobile */}
        <div className="lg:hidden w-full sm:w-auto">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="h-14 w-full sm:w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 active-scale gap-3">
                <Filter className="w-5 h-5" />
                <span className="sm:hidden font-black uppercase tracking-widest">ফিল্টার করুন</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-1 w-6 h-6 bg-accent text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-background">
                    {toBn(activeFilterCount)}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-6 pb-12 bg-background border-none rounded-t-[3rem]">
              <DrawerHeader className="px-0 mb-6">
                <div className="w-12 h-1.5 bg-secondary rounded-full mx-auto mb-6" />
                <DrawerTitle className="text-2xl font-black text-primary flex items-center gap-3">
                  <SlidersHorizontal className="w-6 h-6" /> ফিল্টার করুন
                </DrawerTitle>
                <DrawerDescription className="text-left font-bold text-muted-foreground mt-1">আপনার প্রয়োজনীয় মাদ্রাসাটি দ্রুত খুঁজে নিন</DrawerDescription>
              </DrawerHeader>
              <FilterPanel />
            </DrawerContent>
          </Drawer>
        </div>

        {/* Inline Desktop Filters */}
        <div className="hidden lg:block w-full bg-card p-4 rounded-[2rem] border border-border/40 shadow-soft">
           <FilterPanel isDesktop />
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
           <div className="w-2 h-8 bg-accent rounded-full shadow-sm" />
           <div>
              <p className="text-lg font-black text-foreground tracking-tight">
                মোট <span className="text-primary tabular-nums">{toBn(pagination.total)}</span>টি মাদ্রাসা পাওয়া গেছে
              </p>
              {activeFilterCount > 0 && <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5">ফিল্টার অ্যাপ্লাই করা হয়েছে</p>}
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
            <div className="flex justify-center items-center gap-4 py-12 border-t border-border/40">
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border/60 font-black active-scale px-8 group transition-all"
                disabled={pagination.page <= 1}
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                আগেরটি
              </Button>
              <div className="h-14 px-8 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary text-base border border-primary/10 shadow-sm tabular-nums">
                {toBn(pagination.page)} / {toBn(pagination.totalPages)}
              </div>
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border/60 font-black active-scale px-8 group transition-all"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => { setPage(p => Math.min(pagination.totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                পরবর্তী
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-32 lg:py-48 bg-card rounded-[3rem] border-2 border-dashed border-border/40 shadow-soft">
          <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Search className="w-12 h-12 text-muted-foreground opacity-40" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-4">কোনো মাদ্রাসা পাওয়া যায়নি</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-base font-bold mb-10 leading-relaxed opacity-70">
            আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          <Button className="rounded-2xl h-14 px-10 font-black active-scale bg-primary text-white shadow-lg shadow-primary/20" onClick={clearFilters}>
            সব ফিল্টার মুছে ফেলুন
          </Button>
        </div>
      )}
    </div>
  );
}
