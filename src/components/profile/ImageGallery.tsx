"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import Image from "next/image";
import { cn, toBn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    },
    [closeLightbox, goPrev, goNext]
  );

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid - Premium Native Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openLightbox(i)}
            className="relative group aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-soft active-scale focus:ring-2 focus:ring-primary/20 outline-none"
            aria-label={`${img.alt} — বড় করে দেখুন`}
          >
            <Image
              src={optimizeCloudinaryUrl(img.src)}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized={img.src.startsWith("data:")}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Full-Screen Immersive Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col pt-[env(safe-area-inset-top)]"
            onClick={closeLightbox}
            onKeyDown={handleKey}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            ref={(el) => el?.focus()}
          >
            {/* Top Bar Actions */}
            <div className="flex items-center justify-between px-6 py-4 z-10">
               <div className="flex flex-col">
                  <span className="text-white font-black text-sm">{images[lightboxIndex].alt}</span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">ছবি {toBn(lightboxIndex + 1)} / {toBn(images.length)}</span>
               </div>
               <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active-scale"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center p-4">
               {/* Desktop Nav Controls */}
               <div className="hidden sm:flex absolute inset-x-6 justify-between pointer-events-none z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active-scale pointer-events-auto backdrop-blur-md"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active-scale pointer-events-auto backdrop-blur-md"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
               </div>

               {/* Large Image Container */}
               <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="relative w-full h-full max-w-5xl max-h-[75vh]"
                  onClick={(e) => e.stopPropagation()}
               >
                  <Image
                    src={optimizeCloudinaryUrl(images[lightboxIndex].src)}
                    alt={images[lightboxIndex].alt}
                    fill
                    className="object-contain drop-shadow-2xl"
                    unoptimized={images[lightboxIndex].src.startsWith("data:")}
                    priority
                  />
               </motion.div>
            </div>

            {/* Bottom Info / Action Section */}
            <div className="p-10 text-center safe-bottom">
               <div className="flex justify-center gap-2 mb-6 overflow-x-auto scrollbar-none max-w-full">
                  {images.map((_, i) => (
                     <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                        className={cn(
                           "w-2 h-2 rounded-full transition-all",
                           i === lightboxIndex ? "w-8 bg-accent" : "bg-white/20"
                        )}
                     />
                  ))}
               </div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                  Madrasah Portal Immersive Gallery
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;

