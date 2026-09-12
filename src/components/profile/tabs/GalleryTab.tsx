"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Images, Sparkles, BadgeCheck, Youtube, PlayCircle } from "lucide-react";
import ImageGallery from "@/components/profile/ImageGallery";
import { GalleryImageItem } from "@/data/siteContent";
import { cn, toBn } from "@/lib/utils";

interface GalleryTabProps {
  images: GalleryImageItem[];
  videos?: { url: string; title: string }[];
  label: string;
}

const GalleryTab = ({ images, videos = [], label }: GalleryTabProps) => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  
  return (
  <div className="space-y-8">
    {/* Header Section */}
    <div className="flex items-center justify-between px-2">
       <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-black text-foreground">{label}</h3>
       </div>
       <div className="flex items-center gap-2">
          {videos.length > 0 && (
             <div className="flex bg-slate-100 dark:bg-card/80 rounded-full p-1 border border-slate-100 dark:border-white/10">
                <button 
                  onClick={() => setActiveTab('images')}
                  className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", activeTab === 'images' ? "bg-white dark:bg-white/10 text-primary shadow-sm" : "text-muted-foreground")}
                >
                   ছবি ({toBn(images.length)})
                </button>
                <button 
                  onClick={() => setActiveTab('videos')}
                  className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1", activeTab === 'videos' ? "bg-red-50 dark:bg-red-500/10 text-red-600 shadow-sm" : "text-muted-foreground")}
                >
                   <Youtube className="w-3.5 h-3.5" /> ভিডিও ({toBn(videos.length)})
                </button>
             </div>
          )}
          {videos.length === 0 && (
            <div className="flex items-center gap-1 text-[10px] font-black text-accent bg-accent/5 px-3 py-1 rounded-full uppercase tracking-tighter">
               <Images className="w-3 h-3" />
               {toBn(images.length)}টি ছবি
            </div>
          )}
       </div>
    </div>

    {/* Main Gallery Container */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group transition-all duration-500"
    >
      {activeTab === 'images' ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mb-10 flex items-start gap-5 p-6 rounded-2xl bg-red-50 border border-red-100 relative z-10 dark:bg-red-500/5 dark:border-red-500/10">
             <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <PlayCircle className="w-6 h-6" />
             </div>
             <div>
                <h4 className="text-lg font-black text-foreground">ভিডিও গ্যালারি</h4>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed mt-1">
                   মাদ্রাসার বিভিন্ন কার্যক্রমের ভিডিও চিত্র।
                </p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {videos.map((video, idx) => {
                // Extract YouTube Video ID
                const getYoutubeId = (url: string) => {
                   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                   const match = url.match(regExp);
                   return (match && match[2].length === 11) ? match[2] : null;
                };
                const videoId = getYoutubeId(video.url);
                
                return (
                   <div key={idx} className="bg-white dark:bg-card/60 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-lg group">
                      <div className="relative pt-[56.25%] bg-black">
                         {videoId ? (
                            <iframe 
                               src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                               title={video.title}
                               className="absolute inset-0 w-full h-full border-0"
                               allowFullScreen
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                         ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Invalid URL</div>
                         )}
                      </div>
                      <div className="p-4">
                         <h5 className="font-bold text-foreground text-sm line-clamp-2">{video.title}</h5>
                      </div>
                   </div>
                );
             })}
          </div>
        </>
      )}

      {/* Footer Info */}
      <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-center gap-2">
         <BadgeCheck className="w-4 h-4 text-primary" />
         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Verified Madrasah Gallery</span>
      </div>
    </motion.div>
  </div>
  );
};

export default GalleryTab;

