import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import Image from "next/image";

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

  // Keyboard navigation
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
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {images.map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => openLightbox(i)}
            className="relative group aspect-[4/3] rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${img.alt} — বড় করে দেখুন`}
          >
            <Image
              src={optimizeCloudinaryUrl(img.src)}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized={img.src.startsWith("data:")}
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-foreground/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKey}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="ইমেজ লাইটবক্স"
            ref={(el) => el?.focus()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 touch-target focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="লাইটবক্স বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 touch-target focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="আগের ছবি"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 touch-target focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="পরের ছবি"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-[90vw] max-h-[85vh] px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={optimizeCloudinaryUrl(images[lightboxIndex].src)}
                  alt={images[lightboxIndex].alt}
                  fill
                  className="object-contain rounded-lg shadow-2xl"
                  unoptimized={images[lightboxIndex].src.startsWith("data:")}
                  priority
                />
              </div>
              <p className="text-center text-white/60 text-xs mt-3">
                {images[lightboxIndex].alt} — {lightboxIndex + 1}/{images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
