"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, FileText, Download, Image as ImageIcon, Sparkles, X, ChevronRight, BadgeCheck, Phone } from "lucide-react";
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
        className="bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-500 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-6 sm:p-10 relative z-10">
          <div className="flex items-start gap-4 mb-8 p-6 rounded-2xl bg-accent/5 border border-accent/10">
             <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <ClipboardList className="w-7 h-7" strokeWidth={2.5} />
             </div>
             <div>
                <h4 className="text-xl font-black text-foreground">ভর্তির সাধারণ নিয়মাবলী</h4>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">অ্যাকাডেমিক সেশন {toBn("২০২৪-২৫")}</p>
             </div>
          </div>

          <div className="space-y-4">
            {pc.admissionRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 group/item transition-all duration-300 cursor-default">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-sm font-black text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-white group-hover/item:scale-110 shadow-sm">
                  {toBn(idx + 1)}
                </span>
                <span className="text-base font-bold text-foreground/80 leading-relaxed pt-1">{rule}</span>
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
          className="bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-500 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="p-6 sm:p-10 relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
                <FileText className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-foreground">বিস্তারিত নিয়মাবলী</h2>
            </div>

            {admissionFileType?.startsWith("image/") ? (
              <div className="space-y-4">
                <div
                  className="relative rounded-2xl overflow-hidden border border-border/40 cursor-zoom-in active-scale shadow-sm group"
                  onClick={() => setShowFullImage(!showFullImage)}
                >
                  <div className={cn("relative w-full transition-all duration-500", showFullImage ? "h-auto" : "h-[300px]")}>
                    <Image
                      src={optimizeCloudinaryUrl(admissionFile)}
                      alt="ভর্তি নিয়মাবলী"
                      fill={!showFullImage}
                      width={showFullImage ? 1200 : undefined}
                      height={showFullImage ? 1600 : undefined}
                      className="object-contain bg-slate-50 dark:bg-white/5"
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
              <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-white dark:via-card/60 to-primary/5 border border-primary/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/pdf cursor-pointer">
                <div className="flex items-center gap-5 text-center sm:text-left relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover/pdf:scale-110 group-hover/pdf:-rotate-3 transition-transform duration-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground">ভর্তি গাইডিকা (PDF)</p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">বিস্তারিত তথ্যের জন্য ডাউনলোড করুন</p>
                  </div>
                </div>
                <Button
                  className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 hover:bg-primary/90 transition-transform shadow-lg shadow-primary/20 gap-2 relative z-10"
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
          className="bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg p-6 sm:p-10 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/20 transition-all duration-500 group"
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
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 cursor-zoom-in active-scale bg-slate-50 dark:bg-white/5 shadow-sm group"
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

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-500 cursor-pointer">
         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         
         <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  <Phone className="w-7 h-7" strokeWidth={2.5} />
               </div>
               <div>
                  <h4 className="text-xl font-black text-foreground leading-tight mb-1">ভর্তি হতে সাহায্য লাগবে?</h4>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">আমাদের সাপোর্ট টিমকে কল করুন</p>
               </div>
            </div>
            <div className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/30 group-hover:bg-primary/90 transition-colors shrink-0">
               <Phone className="w-4 h-4 fill-current" /> কল করুন
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

