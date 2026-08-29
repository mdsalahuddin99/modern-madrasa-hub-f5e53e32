"use client";

import { motion } from "framer-motion";
import { Building2, Upload, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { divisions, categories, districtsByDivision, boards } from "@/data/madrasas";
import { thanasByDistrict } from "@/data/thanas";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface HeroSectionProps {
  formData: any;
  update: (field: string, value: any) => void;
  handleFileUpload: (field: "bannerImage" | "admissionFile", file: File) => Promise<any>;
}

export const HeroSection = ({ formData, update, handleFileUpload }: HeroSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-6 md:p-8 mb-6 border border-slate-200 shadow-md relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

      <div className="mb-6">
        <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">ব্যানার ইমেজ</label>
        {formData.bannerImage ? (
          <div className="relative rounded-lg overflow-hidden border border-border/40 aspect-[21/9] bg-muted shadow-inner group">
            <Image
              src={optimizeCloudinaryUrl(formData.bannerImage)}
              alt="Banner"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleFileUpload("bannerImage", file);
                    if (url) update("bannerImage", url);
                  }
                }}
              />
              <Button variant="secondary" className="pointer-events-none">
                <Upload className="w-4 h-4 mr-2" /> পরিবর্তন
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="w-9 h-9 rounded-lg"
                onClick={() => update("bannerImage", "")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload("bannerImage", file);
              };
              input.click();
            }}
            className="w-full aspect-[21/9] rounded-lg border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-foreground block">ব্যানার ইমেজ আপলোড</span>
              <span className="text-[10px] text-muted-foreground mt-1 block">অনুপাত ২১:৯ সাজেস্টেড</span>
            </div>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted-foreground mb-1 block uppercase tracking-widest">মাদ্রাসার নাম *</label>
              <Input
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="যেমন: জামিয়া ইসলামিয়া দারুল উলূম"
                className="h-12 rounded-lg text-lg font-bold border-border/40 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest">ক্যাটাগরি *</label>
              <Select value={formData.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="h-11 rounded-lg border-border/40">
                  <SelectValue placeholder="ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest">শিক্ষা বোর্ড *</label>
              <Select value={formData.board} onValueChange={(v) => update("board", v)}>
                <SelectTrigger className="h-11 rounded-lg border-border/40">
                  <SelectValue placeholder="বোর্ড" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest">প্রতিষ্ঠাকাল *</label>
              <Input
                value={formData.established}
                onChange={(e) => update("established", e.target.value)}
                placeholder="যেমন: ১৯৫০"
                className="h-11 rounded-lg border-border/40 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4 p-4 rounded-lg bg-muted/30 border border-border/40">
          <label className="text-[10px] font-bold text-muted-foreground block uppercase tracking-widest mb-1">অবস্থান নির্বাচন</label>
          <div className="space-y-3">
            <Select value={formData.division} onValueChange={(v) => update("division", v)}>
              <SelectTrigger className="h-10 rounded-lg border-border/40 bg-background/50"><SelectValue placeholder="বিভাগ" /></SelectTrigger>
              <SelectContent>{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={formData.district} onValueChange={(v) => update("district", v)} disabled={!formData.division}>
              <SelectTrigger className="h-10 rounded-lg border-border/40 bg-background/50" disabled={!formData.division}><SelectValue placeholder="জেলা" /></SelectTrigger>
              <SelectContent>{(districtsByDivision[formData.division] || []).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={formData.thana} onValueChange={(v) => update("thana", v)} disabled={!formData.district}>
              <SelectTrigger className="h-10 rounded-lg border-border/40 bg-background/50" disabled={!formData.district}><SelectValue placeholder="থানা" /></SelectTrigger>
              <SelectContent>{(thanasByDistrict[formData.district] || []).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
