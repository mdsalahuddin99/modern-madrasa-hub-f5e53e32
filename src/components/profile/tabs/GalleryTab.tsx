import { motion } from "framer-motion";
import { Images } from "lucide-react";
import ImageGallery from "@/components/profile/ImageGallery";
import { GalleryImageItem } from "@/data/siteContent";

const GalleryTab = ({ images, label }: { images: GalleryImageItem[]; label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    className="float-card bg-card rounded-lg border border-border/60 p-5 md:p-6"
  >
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-9 h-9 rounded-lg gradient-badge flex items-center justify-center">
        <Images className="w-4.5 h-4.5 text-primary" />
      </div>
      <h2 className="text-lg md:text-xl font-bold text-foreground">{label}</h2>
    </div>
    <ImageGallery images={images} />
  </motion.div>
);

export default GalleryTab;
