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
    <section id="search" className="py-12 lg:py-16 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold mb-6">
            <Search className="w-3.5 h-3.5 mr-2" /> ডিসকভারি ইঞ্জিন
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
            সঠিক মাদ্রাসা <span className="text-primary font-light">খুঁজে নিন</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-medium max-w-2xl mx-auto">
            আপনার পছন্দের এলাকার সেরা মাদ্রাসাগুলো খুঁজতে নিচের অপশনগুলো ব্যবহার করুন
          </p>
        </div>

        {/* Luxe Search Container */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-black/5 border border-black/5">
          
          {/* Main Search Input */}
          <div className="flex items-center bg-[#FAFAFA] rounded-2xl px-6 h-16 border border-black/5 focus-within:border-primary/30 focus-within:ring-4 ring-primary/10 transition-all mb-6">
            <Search className="w-6 h-6 text-primary mr-4" />
            <input
              ref={searchInputRef}
              placeholder="যেকোনো মাদ্রাসার নাম লিখে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-lg font-bold placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Filters & Button Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            
            {/* Dropdowns */}
            <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <LocationSelector
                className="contents"
                divisionId={selectedDivision}
                onDivisionChange={(id) => setSelectedDivision(id)}
                districtId={selectedDistrict}
                onDistrictChange={(id) => setSelectedDistrict(id)}
                thanaId=""
                onThanaChange={() => {}}
              />
              
              <div className="w-full">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 rounded-lg border-border/40 bg-background/70 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="ক্যাটাগরি" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 shadow-xl">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="font-medium focus:bg-primary/5">
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
                className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4" /> খুঁজুন</>}
              </button>
            </div>

          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
           <span className="text-xs font-bold text-muted-foreground">পপুলার সার্চ:</span>
           <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => {setSearchQuery(term); handleSearch();}}
                  className="text-xs font-bold text-foreground bg-[#FAFAFA] hover:bg-primary hover:text-white border border-black/5 rounded-full px-5 py-2 transition-all shadow-sm"
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
