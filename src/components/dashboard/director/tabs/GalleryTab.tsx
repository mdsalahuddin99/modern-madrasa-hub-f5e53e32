import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface GalleryTabProps {
  formData: any;
  update: (field: string, value: any) => void;
  addGalleryImages: (files: FileList) => Promise<any>;
  removeGalleryImage: (index: number) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const GalleryTab = ({ formData, update, addGalleryImages, removeGalleryImage, readOnly = false, onLockedAction }: GalleryTabProps) => {
  const videos = formData.galleryVideos || [];

  const handleAddVideo = () => update("galleryVideos", [...videos, { youtubeUrl: "", title: "" }]);
  const handleRemoveVideo = (index: number) => update("galleryVideos", videos.filter((_: any, i: number) => i !== index));
  const handleUpdateVideo = (index: number, field: string, val: string) => {
    const vids = [...videos];
    vids[index] = { ...vids[index], [field]: val };
    update("galleryVideos", vids);
  };

  return (
    <div className="space-y-5 relative">
      <div className="glass-card rounded-lg p-5 space-y-4 relative">
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
          className="gap-1.5 rounded-lg text-xs h-8"
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
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border/40 aspect-video bg-muted">
              <img
                src={optimizeCloudinaryUrl(img)}
                alt={`Gallery ${i + 1}`}
                className="object-cover w-full h-full"
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

      {/* Video Gallery Section */}
      <div className="glass-card rounded-lg p-5 space-y-4 mt-8 relative">
        {readOnly && (
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
            onClick={onLockedAction}
          />
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">ভিডিও গ্যালারি (YouTube)</h3>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={readOnly}
            onClick={handleAddVideo} 
            className="gap-1.5 rounded-lg text-xs h-8"
          >
            ভিডিও যোগ
          </Button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">এখনো কোনো ভিডিও যোগ হয়নি</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((vid: any, i: number) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 bg-muted/50 p-3 rounded-lg border border-border/40 relative pr-10 sm:pr-3">
                <Input
                  placeholder="YouTube URL"
                  value={vid.youtubeUrl}
                  onChange={(e) => handleUpdateVideo(i, "youtubeUrl", e.target.value)}
                  disabled={readOnly}
                  className="bg-background/60 h-9"
                />
                <Input
                  placeholder="ভিডিও টাইটেল (ঐচ্ছিক)"
                  value={vid.title}
                  onChange={(e) => handleUpdateVideo(i, "title", e.target.value)}
                  disabled={readOnly}
                  className="bg-background/60 h-9 sm:max-w-[250px]"
                />
                <button
                  onClick={() => handleRemoveVideo(i)}
                  disabled={readOnly}
                  className="absolute sm:relative top-3 sm:top-0 right-3 sm:right-0 w-9 h-9 shrink-0 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
