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
      className="relative group transition-all duration-500"
    >
      <div className="mb-10 flex items-start gap-5 p-6 rounded-2xl bg-primary/5 border border-primary/10 relative z-10">
         <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Sparkles className="w-6 h-6" />
         </div>
         <div>
            <h4 className="text-lg font-black text-foreground">মাদ্রাসার দৃশ্যপট</h4>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed mt-1">
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

