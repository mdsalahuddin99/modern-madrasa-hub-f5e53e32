import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { MadrasaFormData } from "@/types/madrasa";

interface AdmissionTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: any) => void;
  updateRule: (index: number, value: string) => void;
  addRule: () => void;
  removeRule: (index: number) => void;
  handleFileUpload: (field: "admissionFile") => void;
  handleAdmissionImagesUpload: () => void;
  removeAdmissionImage: (index: number) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const AdmissionTab = ({
  formData,
  update,
  updateRule,
  addRule,
  removeRule,
  handleFileUpload,
  handleAdmissionImagesUpload,
  removeAdmissionImage,
  readOnly = false,
  onLockedAction,
}: AdmissionTabProps) => {
  return (
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
        <h3 className="text-base font-bold text-foreground">ভর্তি নিয়মাবলী</h3>
        <Button variant="outline" size="sm" onClick={addRule} disabled={readOnly} className="gap-1.5 rounded-lg text-xs h-8">
          <Plus className="w-3.5 h-3.5" /> নিয়ম যোগ
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {formData.admissionRules.map((rule: string, i: number) => (
          <AccordionItem key={i} value={`rule-${i}`} className="border border-border/40 bg-muted/30 rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-3 text-sm font-bold text-left">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {i + 1}
                  </span>
                  {rule.substring(0, 30) || `নিয়ম ${i + 1}`}{rule.length > 30 ? "..." : ""}
                </div>
              </AccordionTrigger>
              {formData.admissionRules.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRule(i);
                  }}
                  disabled={readOnly}
                  className="h-8 w-8 rounded-full text-destructive/50 hover:text-destructive hover:bg-destructive/10 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <AccordionContent className="pb-4">
              <div className="pt-2 border-t border-border/40 mt-2">
                <Input
                  value={rule}
                  onChange={(e) => updateRule(i, e.target.value)}
                  disabled={readOnly}
                  placeholder={`নিয়ম ${i + 1}`}
                  className="flex-1 h-10 rounded-lg bg-background/60 border-border/50 text-sm"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Admission File Upload */}
      <div className="border-t border-border/40 pt-4">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">ভর্তির নিয়মাবলী (PDF/ইমেজ আপলোড)</label>
        {formData.admissionFile ? (
          <div className="relative rounded-lg border border-border/40 overflow-hidden bg-muted/30">
            {formData.admissionFileType?.startsWith("image/") ? (
              <div className="relative w-full max-h-60 aspect-video">
                <Image
                  src={optimizeCloudinaryUrl(formData.admissionFile)}
                  alt="Admission Rules"
                  fill
                  className="object-contain"
                  unoptimized={typeof formData.admissionFile === 'string' && formData.admissionFile.startsWith("data:")}
                />
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground">পিডিএফ ফাইল আপলোড করা হয়েছে</p>
                <a 
                  href={formData.admissionFile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline"
                >
                  ফাইলটি দেখুন
                </a>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                onClick={() => handleFileUpload("admissionFile")}
                disabled={readOnly}
                className="w-8 h-8 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  update("admissionFile", "");
                  update("admissionFileType", "");
                }}
                disabled={readOnly}
                className="w-8 h-8 rounded-lg bg-destructive/80 text-white flex items-center justify-center hover:bg-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleFileUpload("admissionFile")}
            disabled={readOnly}
            className="w-full p-4 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <Upload className="w-5 h-5 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">PDF বা ইমেজ আপলোড করুন</span>
            <span className="text-[10px] text-muted-foreground/60">সর্বোচ্চ ২MB</span>
          </button>
        )}
      </div>

      {/* Admission Images Gallery */}
      <div className="border-t border-border/40 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">ভর্তি সংক্রান্ত ছবি (একাধিক আপলোড করুন)</label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdmissionImagesUpload}
            disabled={readOnly}
            className="gap-1.5 rounded-lg text-xs h-8"
          >
            <Upload className="w-3.5 h-3.5" /> ছবি যোগ
          </Button>
        </div>
        {(formData.admissionImages || []).length === 0 ? (
          <div className="text-center py-6 rounded-lg border-2 border-dashed border-border/40 bg-muted/10">
            <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
            <p className="text-xs text-muted-foreground">ভর্তি ফরম, নোটিশ, বিজ্ঞপ্তি ইত্যাদির ছবি আপলোড করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(formData.admissionImages || []).map((img: string, i: number) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border/40 aspect-[4/5] bg-muted">
                <Image
                  src={optimizeCloudinaryUrl(img)}
                  alt={`ভর্তি ছবি ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={typeof img === 'string' && img.startsWith("data:")}
                />
                <button
                  onClick={() => removeAdmissionImage(i)}
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
    </div>
  );
};
