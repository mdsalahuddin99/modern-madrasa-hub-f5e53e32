import { motion } from "framer-motion";
import { ClipboardList, FileText, Download, Image as ImageIcon } from "lucide-react";
import { ProfileContent } from "@/data/siteContent";
import { Button } from "@/components/ui/button";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { useState } from "react";
import Image from "next/image";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

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
    <div className="space-y-5 md:space-y-6">
      <motion.div {...fadeUp(0.05)} className="float-card bg-card rounded-lg border border-border/60 p-5 md:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <ClipboardList className="w-4.5 h-4.5 text-accent" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">{pc.admissionTitle}</h2>
        </div>
        <div className="space-y-2.5">
          {pc.admissionRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
              <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent">
                {idx + 1}
              </span>
              <span className="text-sm text-foreground">{rule}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Admission File (PDF/Image) */}
      {admissionFile && (
        <motion.div {...fadeUp(0.1)} className="float-card bg-card rounded-lg border border-border/60 p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-primary" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">ভর্তির বিস্তারিত নিয়মাবলী</h2>
          </div>

          {admissionFileType?.startsWith("image/") ? (
            <div>
              <div
                className="relative rounded-lg overflow-hidden border border-border/40 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowFullImage(!showFullImage)}
              >
                <div className={`relative w-full ${showFullImage ? "aspect-auto" : "aspect-video max-h-80"}`}>
                  <Image
                    src={optimizeCloudinaryUrl(admissionFile)}
                    alt="ভর্তি নিয়মাবলী"
                    fill={!showFullImage}
                    width={showFullImage ? 1200 : undefined}
                    height={showFullImage ? 1600 : undefined}
                    className="object-contain bg-muted/30"
                    unoptimized={admissionFile.startsWith("data:")}
                  />
                </div>
              </div>
              {!showFullImage && (
                <button
                  onClick={() => setShowFullImage(true)}
                  className="mt-2 text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
                >
                  <ImageIcon className="w-3 h-3" /> পুরো ইমেজ দেখুন
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">ভর্তি নিয়মাবলী (PDF)</p>
                <p className="text-xs text-muted-foreground">ডাউনলোড করে বিস্তারিত দেখুন</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-1.5 text-xs"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = admissionFile;
                  link.download = "admission-rules.pdf";
                  link.click();
                }}
              >
                <Download className="w-3.5 h-3.5" /> ডাউনলোড
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Admission Images Gallery */}
      {admissionImages && admissionImages.length > 0 && (
        <motion.div {...fadeUp(0.15)} className="float-card bg-card rounded-lg border border-border/60 p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <ImageIcon className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">ভর্তি সংক্রান্ত ছবি</h2>
              <p className="text-xs text-muted-foreground">ভর্তি ফরম, নোটিশ, বিজ্ঞপ্তি ইত্যাদি</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {admissionImages.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border/40 cursor-zoom-in group bg-muted/20"
                onClick={() => setLightboxImg(img)}
              >
                <Image
                  src={optimizeCloudinaryUrl(img)}
                  alt={`ভর্তি ছবি ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={img.startsWith("data:")}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightboxImg}
            alt="ভর্তি ছবি"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default AdmissionTab;
