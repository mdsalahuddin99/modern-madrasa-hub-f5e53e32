"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Search, MapPin, Users, Calendar, ArrowUpRight, X, SlidersHorizontal, Loader2, Layers, CheckCircle2 } from "lucide-react";
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
import { categories } from "@/data/madrasas";
import { LocationSelector } from "@/components/ui/location-selector";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)",
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা বাংলাদেশ",
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ",
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ",
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ",
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ (জাতীয় দ্বীনি মাদ্রাসা শিক্ষা বোর্ড)",
];

function MadrasaCard({ madrasa }: { madrasa: Madrasa }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="float-card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
    >
      <Link href={`/madrasas/${madrasa.slug}`}>
        <div className="aspect-[16/9] overflow-hidden relative bg-muted flex items-center justify-center">
          {madrasa.image ? (
            <Image 
              src={madrasa.image} 
              alt={madrasa.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="text-muted-foreground font-semibold text-lg opacity-30">
              {madrasa.name.slice(0, 2)}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary/90 text-white backdrop-blur-md border-0 text-[10px] font-bold px-2.5 py-1">
              {madrasa.category}
            </Badge>
          </div>
          {madrasa.featured && (
            <div className="absolute top-3 right-3">
              <div className="bg-gold/90 backdrop-blur-md rounded-full p-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 relative">
          {/* Hover gradient effect similar to categories */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">{madrasa.board}</span>
          </div>
          <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1 relative z-10">
            {madrasa.name}
          </h3>
          
          <div className="space-y-3 mb-6 relative z-10">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="line-clamp-1">{madrasa.thana}, {madrasa.district}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <span>{madrasa.students} ছাত্র</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span>{madrasa.established || "অজানা"}</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full rounded-xl text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 py-6 relative z-10"
          >
            বিস্তারিত দেখুন <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MadrasaListClient({ initialData }: MadrasaListClientProps) {
  const searchParams = useSearchParams();
  const sp = searchParams;
  
  const [search, setSearch] = useState(sp?.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(sp?.get("search") || "");
  
  const [divisionId, setDivisionId] = useState<string>(sp?.get("divisionId") || "");
  const [districtId, setDistrictId] = useState<string>(sp?.get("districtId") || "");
  const [thanaId, setThanaId] = useState<string>(sp?.get("thanaId") || "");
  
  const [category, setCategory] = useState<string>(sp?.get("category") || "");
  const [board, setBoard] = useState<string>(sp?.get("board") || "");
  
  const [page, setPage] = useState(1);
  const limit = 12;

  const [showFilters, setShowFilters] = useState(!!(sp?.get("divisionId") || sp?.get("category")));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [divisionId, districtId, thanaId, category, board]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.set("search", debouncedSearch);
  if (divisionId) queryParams.set("divisionId", divisionId);
  if (districtId) queryParams.set("districtId", districtId);
  if (thanaId) queryParams.set("thanaId", thanaId);
  if (category) queryParams.set("category", category);
  if (board) queryParams.set("board", board);
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
    setCategory("");
    setBoard("");
    setPage(1);
  };

  const hasActiveFilters = search || divisionId || districtId || thanaId || category || board;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="মাদ্রাসার নাম, ঠিকানা বা বিবরণ দিয়ে খুঁজুন..."
            className="pl-10 h-12 rounded-2xl border-border/50 bg-card shadow-sm focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={`h-12 px-5 rounded-2xl border-border/50 font-bold gap-2 transition-colors ${showFilters ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-primary/5 hover:text-primary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            ফিল্টার {hasActiveFilters && <Badge className="ml-1 h-5 min-w-5 px-1 bg-primary">!</Badge>}
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              className="h-12 px-4 rounded-2xl text-muted-foreground hover:text-destructive"
              onClick={clearFilters}
            >
              <X className="w-4 h-4 mr-2" /> মুছে ফেলুন
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Location Selection directly integrated in the grid */}
                <LocationSelector
                  className="contents"
                  divisionId={divisionId}
                  onDivisionChange={(id) => setDivisionId(id)}
                  districtId={districtId}
                  onDistrictChange={(id) => setDistrictId(id)}
                  thanaId={thanaId}
                  onThanaChange={(id) => setThanaId(id)}
                />

                <Select value={category === "all" ? "all" : category || undefined} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm transition-all" aria-label="ক্যাটাগরি">
                    <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="সব ক্যাটাগরি" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={board === "all" ? "all" : board || undefined} onValueChange={setBoard}>
                  <SelectTrigger className="h-12 sm:h-13 rounded-2xl border-border/40 bg-background/70 text-sm shadow-sm transition-all" aria-label="বোর্ড">
                    <SelectValue placeholder="সব বোর্ড" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">সব বোর্ড</SelectItem>
                    {boards.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">
          মোট <span className="font-extrabold text-primary text-lg">{pagination.total}</span> টি মাদ্রাসা পাওয়া গেছে
        </p>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>

      {madrasas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <AnimatePresence mode="popLayout">
              {madrasas.map((madrasa: Madrasa) => (
                <MadrasaCard key={madrasa.id} madrasa={madrasa} />
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pagination UI */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={pagination.page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                পূর্ববর্তী
              </Button>
              <div className="text-sm font-medium px-4">
                পৃষ্ঠা {pagination.page} / {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              >
                পরবর্তী
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/60">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">কোনো মাদ্রাসা পাওয়া যায়নি</h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm mb-6">
            আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="rounded-xl" onClick={clearFilters}>
              সব ফিল্টার মুছে ফেলুন
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
