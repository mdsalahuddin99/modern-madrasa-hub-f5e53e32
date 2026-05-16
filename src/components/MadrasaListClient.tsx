"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { Search, MapPin, Users, Calendar, ArrowUpRight, Filter, X, SlidersHorizontal, Loader2 } from "lucide-react";
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
import { divisions, districtsByDivision, categories } from "@/data/madrasas";
import { thanasByDistrict } from "@/data/thanas";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Madrasa {
  id: string;
  name: string;
  division: string;
  district: string;
  thana: string;
  category: string;
  board: string;
  established: string;
  students: number;
  image: string | null;
  description: string;
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

function MadrasaCard({ madrasa }: { madrasa: Madrasa }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="float-card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
    >
      <Link href={`/madrasas/${madrasa.id}`}>
        <div className="aspect-[16/9] overflow-hidden relative">
          <Image 
            src={madrasa.image || "/placeholder.svg"} 
            alt={madrasa.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary/90 backdrop-blur-md border-0 text-[10px] font-bold">
              {madrasa.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{madrasa.board}</span>
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
            {madrasa.name}
          </h3>
          
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="line-clamp-1">{madrasa.thana}, {madrasa.district}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{madrasa.students} ছাত্র</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{madrasa.established || "তথ্য নেই"}</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full rounded-xl text-xs gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
          >
            বিস্তারিত দেখুন <ArrowUpRight className="w-3.5 h-3.5" />
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
  const [division, setDivision] = useState<string>(sp?.get("division") || "all");
  const [district, setDistrict] = useState<string>(sp?.get("district") || "all");
  const [thana, setThana] = useState<string>(sp?.get("thana") || "all");
  const [category, setCategory] = useState<string>(sp?.get("category") || "all");
  const [showFilters, setShowFilters] = useState(!!(sp?.get("division") || sp?.get("category")));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const districts = useMemo(() => 
    division !== "all" ? districtsByDivision[division] || [] : [], 
  [division]);

  const thanas = useMemo(() => 
    district !== "all" ? thanasByDistrict[district] || [] : [], 
  [district]);

  // Reset district/thana when parent changes (but not on initial mount)
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false);
      return;
    }
    setDistrict("all");
    setThana("all");
  }, [division]);

  useEffect(() => {
    if (isFirstMount) return;
    setThana("all");
  }, [district]);

  const queryParams = new URLSearchParams();
  if (debouncedSearch) queryParams.set("search", debouncedSearch);
  if (division !== "all") queryParams.set("division", division);
  if (district !== "all") queryParams.set("district", district);
  if (thana !== "all") queryParams.set("thana", thana);
  if (category !== "all") queryParams.set("category", category);

  const { data, isLoading } = useSWR(
    `/api/madrasas?${queryParams.toString()}`,
    {
      fallbackData: queryParams.toString() === "" ? initialData : undefined,
      keepPreviousData: true,
    }
  );

  const madrasas = data?.madrasas || [];

  const clearFilters = () => {
    setSearch("");
    setDivision("all");
    setDistrict("all");
    setThana("all");
    setCategory("all");
  };

  const hasActiveFilters = search || division !== "all" || district !== "all" || thana !== "all" || category !== "all";

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
            className={`h-12 px-5 rounded-2xl border-border/50 gap-2 ${showFilters ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">বিভাগ</label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="h-11 rounded-xl border-border/40">
                    <SelectValue placeholder="সব বিভাগ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব বিভাগ</SelectItem>
                    {divisions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">জেলা</label>
                <Select value={district} onValueChange={setDistrict} disabled={division === "all"}>
                  <SelectTrigger className="h-11 rounded-xl border-border/40">
                    <SelectValue placeholder="সব জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব জেলা</SelectItem>
                    {districts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">থানা</label>
                <Select value={thana} onValueChange={setThana} disabled={district === "all"}>
                  <SelectTrigger className="h-11 rounded-xl border-border/40">
                    <SelectValue placeholder="সব থানা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব থানা</SelectItem>
                    {thanas.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">ক্যাটাগরি</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 rounded-xl border-border/40">
                    <SelectValue placeholder="সব ক্যাটাগরি" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
        <p className="text-muted-foreground text-sm">
          মোট <span className="font-bold text-foreground">{data?.pagination?.total || 0}</span> টি মাদ্রাসা পাওয়া গেছে
        </p>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>

      {madrasas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {madrasas.map((madrasa: Madrasa) => (
              <MadrasaCard key={madrasa.id} madrasa={madrasa} />
            ))}
          </AnimatePresence>
        </div>
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
