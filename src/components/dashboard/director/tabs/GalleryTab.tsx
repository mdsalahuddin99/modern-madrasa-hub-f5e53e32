import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface GalleryTabProps {
  formData: any;
  addGalleryImages: (files: FileList) => Promise<any>;
  removeGalleryImage: (index: number) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const GalleryTab = ({ formData, addGalleryImages, removeGalleryImage, readOnly = false, onLockedAction }: GalleryTabProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 relative">
      {readOnly && (
        <button
          type="button"
          aria-label="লকড ফিচার"
          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
          onClick={onLockedAction}
        />
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">ক্যাম্পাস গ্যালারি</h3>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={readOnly}
          onClick={() => {
            if (readOnly) {
              onLockedAction?.();
              return;
            }
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) addGalleryImages(files);
            };
            input.click();
          }} 
          className="gap-1.5 rounded-xl text-xs h-8"
        >
          <ImageIcon className="w-3.5 h-3.5" /> ছবি যোগ
        </Button>
      </div>
      {formData.galleryImages.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">এখনো কোনো ছবি যোগ হয়নি</p>
          <p className="text-xs mt-1">উপরের বাটনে ক্লিক করে ছবি যোগ করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {formData.galleryImages.map((img: string, i: number) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-border/40 aspect-video bg-muted">
              <Image
                src={optimizeCloudinaryUrl(img)}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={img.startsWith("data:")}
              />
              <button
                onClick={() => removeGalleryImage(i)}
                disabled={readOnly}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-destructive/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
