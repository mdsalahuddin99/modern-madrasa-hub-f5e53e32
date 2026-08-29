"use client";

import { motion } from "framer-motion";
import { Images, Sparkles, BadgeCheck } from "lucide-react";
import ImageGallery from "@/components/profile/ImageGallery";
import { GalleryImageItem } from "@/data/siteContent";
import { cn, toBn } from "@/lib/utils";

const GalleryTab = ({ images, label }: { images: GalleryImageItem[]; label: string }) => (
  <div className="space-y-8">
    {/* Header Section */}
    <div className="flex items-center justify-between px-2">
       <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-black text-foreground">{label}</h3>
       </div>
       <div className="flex items-center gap-1 text-[10px] font-black text-accent bg-accent/5 px-3 py-1 rounded-full uppercase tracking-tighter">
          <Images className="w-3 h-3" />
          {toBn(images.length)}টি ছবি
       </div>
    </div>

    {/* Main Gallery Container */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft p-4 sm:p-8"
    >
      <div className="mb-8 flex items-start gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/40">
         <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/10">
            <Sparkles className="w-5 h-5" />
         </div>
         <div>
            <h4 className="text-sm font-black text-foreground">মাদ্রাসার দৃশ্যপট</h4>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed mt-0.5">
               আমাদের মাদ্রাসার মনোরম পরিবেশ এবং শিক্ষা কার্যক্রমের কিছু স্থিরচিত্র নিচে দেওয়া হলো। বড় করে দেখতে ছবিতে ক্লিক করুন।
            </p>
         </div>
      </div>

      <ImageGallery images={images} />

      {/* Footer Info */}
      <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-center gap-2">
         <BadgeCheck className="w-4 h-4 text-primary" />
         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Verified Madrasah Gallery</span>
      </div>
    </motion.div>
  </div>
);

export default GalleryTab;
