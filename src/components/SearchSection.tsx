"use client";

import { useState, useRef } from "react";
import { Search, MapPin, Loader2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { categories } from "@/data/madrasas";
import { useSiteContent } from "@/hooks/useSiteContent";
import { LocationSelector } from "@/components/ui/location-selector";
import { toBn } from "@/lib/utils";

const popularSearches = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী"];

const SearchSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { content } = useSiteContent();
  const s = content.search;

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedDivision) params.set("division", selectedDivision);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/madrasas?${params.toString()}`);
  };

  return (
    <section id="search" className="py-20 lg:py-32 bg-background border-b-2 border-foreground overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Sharp Header */}
        <div className="mb-16">
          <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Discovery Engine
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">
            সঠিক মাদ্রাসা <br />
            <span className="text-primary">খুঁজে নিন</span>
          </h2>
        </div>

        {/* Brutalist Search Component */}
        <div className="grid lg:grid-cols-12 border-2 border-foreground shadow-sharp bg-background">

          {/* Main Input */}
          <div className="lg:col-span-5 p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground flex items-center gap-4">
            <Search className="w-6 h-6 text-foreground" strokeWidth={3} />
            <input
              ref={searchInputRef}
              placeholder="মাদ্রাসার নাম লিখুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xl font-bold placeholder:text-foreground/20"
            />
          </div>

          {/* Location & Category Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2">
             <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-foreground flex items-center">
                <LocationSelector
                  className="contents"
                  divisionId={selectedDivision}
                  onDivisionChange={(id) => setSelectedDivision(id)}
                  districtId={selectedDistrict}
                  onDistrictChange={(id) => setSelectedDistrict(id)}
                  thanaId=""
                  onThanaChange={() => {}}
                />
             </div>
             <div className="p-4 border-foreground flex items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-none bg-transparent shadow-none focus:ring-0 font-bold text-lg">
                    <SelectValue placeholder="ক্যাটাগরি" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-foreground shadow-sharp">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="font-bold focus:bg-primary focus:text-white">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full h-full min-h-[80px] bg-foreground text-background hover:bg-primary transition-colors font-black uppercase text-sm tracking-widest active-press flex items-center justify-center gap-3"
            >
              {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-5 h-5" />{s.buttonText}</>}
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-12 flex flex-wrap items-center gap-8">
           <span className="text-[10px] font-black uppercase text-foreground tracking-[0.2em]">পপুলার সার্চ:</span>
           <div className="flex flex-wrap gap-3">
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => {setSearchQuery(term); handleSearch();}}
                  className="text-xs font-black text-foreground hover:bg-primary hover:text-white border-2 border-foreground px-4 py-1.5 transition-all active-press"
                >
                  {term}
                </button>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
