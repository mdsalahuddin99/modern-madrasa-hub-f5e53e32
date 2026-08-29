"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, FileText, Download, Image as ImageIcon, Sparkles, X, ChevronRight, BadgeCheck } from "lucide-react";
import { ProfileContent } from "@/data/siteContent";
import { Button } from "@/components/ui/button";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { useState } from "react";
import Image from "next/image";
import { cn, toBn } from "@/lib/utils";

interface AdmissionTabProps {
  pc: ProfileContent;
  admissionFile?: string;
  admissionFileType?: string;
  admissionImages?: string[];
}

const AdmissionTab = ({ pc, admissionFile, admissionFileType, admissionImages }: AdmissionTabProps) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-accent rounded-full" />
        <h3 className="text-xl font-black text-foreground">{pc.admissionTitle}</h3>
      </div>

      {/* Rules Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden"
      >
        <div className="p-6 sm:p-10">
          <div className="flex items-start gap-4 mb-8 p-5 rounded-2xl bg-accent/5 border border-accent/10">
             <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent/20">
                <ClipboardList className="w-6 h-6" strokeWidth={2.5} />
             </div>
             <div>
                <h4 className="text-lg font-black text-foreground">ভর্তির সাধারণ নিয়মাবলী</h4>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">অ্যাকাডেমিক সেশন {toBn("২০২৪-২৫")}</p>
             </div>
          </div>

          <div className="space-y-4">
            {pc.admissionRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/20 border border-border/40 group active-scale cursor-default transition-all hover:bg-white">
                <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xs font-black text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {toBn(idx + 1)}
                </span>
                <span className="text-sm font-bold text-foreground/80 leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Admission File Section */}
      {admissionFile && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem]" />

          <div className="p-6 sm:p-10 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-foreground">বিস্তারিত নিয়মাবলী</h2>
            </div>

            {admissionFileType?.startsWith("image/") ? (
              <div className="space-y-4">
                <div
                  className="relative rounded-[2rem] overflow-hidden border border-border/40 cursor-zoom-in active-scale shadow-sm group"
                  onClick={() => setShowFullImage(!showFullImage)}
                >
                  <div className={cn("relative w-full transition-all duration-500", showFullImage ? "h-auto" : "h-[300px]")}>
                    <Image
                      src={optimizeCloudinaryUrl(admissionFile)}
                      alt="ভর্তি নিয়মাবলী"
                      fill={!showFullImage}
                      width={showFullImage ? 1200 : undefined}
                      height={showFullImage ? 1600 : undefined}
                      className="object-contain bg-secondary/20"
                      unoptimized={admissionFile.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                </div>
                <div className="flex justify-center">
                   <Button
                      variant="ghost"
                      onClick={() => setShowFullImage(!showFullImage)}
                      className="text-xs font-black text-primary uppercase tracking-widest active-scale"
                   >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {showFullImage ? "সংক্ষিপ্ত ভিউ" : "পূর্ণ ছবি দেখুন"}
                   </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6 active-scale cursor-pointer group">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-black text-foreground">ভর্তি গাইডিকা (PDF)</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">বিস্তারিত তথ্যের জন্য ডাউনলোড করুন</p>
                  </div>
                </div>
                <Button
                  className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest active-scale gap-2"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = admissionFile;
                    link.download = "admission-rules.pdf";
                    link.click();
                  }}
                >
                  <Download className="w-5 h-5" /> ডাউনলোড
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Admission Gallery */}
      {admissionImages && admissionImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft p-6 sm:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                 <ImageIcon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-foreground">ভর্তি গ্যালারি</h2>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter">
               {toBn(admissionImages.length)}টি ছবি
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {admissionImages.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden border border-border/40 cursor-zoom-in active-scale bg-secondary/20 shadow-sm group"
                onClick={() => setLightboxImg(img)}
              >
                <Image
                  src={optimizeCloudinaryUrl(img)}
                  alt={`ভর্তি ছবি ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized={img.startsWith("data:")}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subscription Callout */}
      <div className="p-8 rounded-[2.5rem] bg-primary text-white relative overflow-hidden shadow-2xl shadow-primary/20 group active-scale cursor-pointer">
         <div className="absolute inset-0 islamic-pattern opacity-10" />
         <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-accent" strokeWidth={2.5} />
               </div>
               <div>
                  <h4 className="text-lg font-black leading-tight">ভর্তি হতে সাহায্য লাগবে?</h4>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">আমাদের সাপোর্ট টিমকে কল করুন</p>
               </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent transition-colors">
               <ChevronRight className="w-5 h-5" />
            </div>
         </div>
      </div>

      {/* Native Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col pt-[env(safe-area-inset-top)]"
            onClick={() => setLightboxImg(null)}
          >
            <div className="flex justify-end p-6">
               <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active-scale">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -20 }}
                className="relative w-full h-full max-w-4xl max-h-[80vh]"
              >
                <img
                  src={lightboxImg}
                  alt="ভর্তি তথ্য পূর্ণ ছবি"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
            <div className="p-10 text-center safe-bottom">
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Madrasah Portal Admission Guide</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdmissionTab;
