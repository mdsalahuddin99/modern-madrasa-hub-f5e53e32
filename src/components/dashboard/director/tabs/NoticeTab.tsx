"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, BellRing, FileText, Upload, CalendarIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MadrasaFormData } from "@/types/madrasa";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import Image from "next/image";

interface NoticeTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: any) => void;
  notices: any[];
  updateNotice: (notices: any[]) => void;
  handleFileUpload: (field: any, file: File) => Promise<string | null>;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const NoticeTab = ({ formData, update, notices, updateNotice, handleFileUpload, readOnly = false, onLockedAction }: NoticeTabProps) => {
  const addNotice = () => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    const newNotice = {
      id: crypto.randomUUID(),
      type: "NOTICE",
      title: "",
      content: "",
      isPublished: true,
      imageUrl: "",
      fileUrl: "",
      eventDate: "",
    };
    updateNotice([newNotice, ...notices]);
  };

  const removeNotice = (id: string) => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    updateNotice(notices.filter((t) => t.id !== id));
  };

  const updateNoticeField = (id: string, field: string, value: any) => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    updateNotice(
      notices.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="space-y-6 relative">
      {readOnly && (
        <button
          type="button"
          aria-label="লকড ফিচার"
          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
          onClick={onLockedAction}
        />
      )}
      
      <div className="float-card bg-card rounded-lg border border-border/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" />
            নোটিশ, নিউজ ও ইভেন্ট
          </h3>
          <Button variant="outline" size="sm" onClick={addNotice} disabled={readOnly} className="gap-2 rounded-lg h-9 px-4 border-primary/20 text-primary hover:bg-primary/5">
            <Plus className="w-4 h-4" /> নতুন যোগ করুন
          </Button>
        </div>

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/40">
              <FileText className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">কোন নোটিশ বা ইভেন্ট যুক্ত করা হয়নি</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {notices.map((notice, index) => (
                <AccordionItem key={notice.id} value={notice.id} className="border border-border/40 bg-muted/30 rounded-lg px-4">
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-1 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3 text-sm font-bold text-left">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs">
                          {notice.type === "NOTICE" ? "নোটিশ" : notice.type === "NEWS" ? "নিউজ" : "ইভেন্ট"}
                        </span>
                        {notice.title || `আইটেম ${index + 1}`}
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotice(notice.id);
                      }}
                      disabled={readOnly}
                      className="h-8 w-8 rounded-full text-destructive/50 hover:text-destructive hover:bg-destructive/10 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <AccordionContent className="pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/40 mt-2">
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex gap-2">
                        <select
                          value={notice.type}
                          onChange={(e) => updateNoticeField(notice.id, "type", e.target.value)}
                          disabled={readOnly}
                          className="h-10 px-3 rounded-lg bg-background/60 border border-border/50 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="NOTICE">নোটিশ</option>
                          <option value="NEWS">নিউজ</option>
                          <option value="EVENT">ইভেন্ট</option>
                        </select>
                        <Input
                          value={notice.title}
                          onChange={(e) => updateNoticeField(notice.id, "title", e.target.value)}
                          disabled={readOnly}
                          placeholder="শিরোনাম"
                          className="h-10 flex-1 rounded-lg bg-background/60 border-border/50 text-sm font-bold"
                        />
                      </div>
                      
                      {notice.type === "EVENT" && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="datetime-local"
                            value={notice.eventDate ? new Date(notice.eventDate).toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateNoticeField(notice.id, "eventDate", e.target.value)}
                            disabled={readOnly}
                            className="h-9 w-full sm:w-auto rounded-lg bg-background/60 border-border/50 text-xs"
                          />
                        </div>
                      )}

                      <Textarea
                        value={notice.content}
                        onChange={(e) => updateNoticeField(notice.id, "content", e.target.value)}
                        disabled={readOnly}
                        placeholder="বিস্তারিত বিবরণ..."
                        className="min-h-[100px] rounded-lg bg-background/60 border-border/50 text-sm resize-none"
                      />
                      
                      <div className="flex items-center gap-2">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notice.isPublished}
                              onChange={(e) => updateNoticeField(notice.id, "isPublished", e.target.checked)}
                              disabled={readOnly}
                              className="rounded text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="text-xs text-muted-foreground">পাবলিক (সবাই দেখতে পাবে)</span>
                         </label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground block">ছবি (ঐচ্ছিক)</label>
                      <div className="w-full h-32 rounded-lg bg-background border border-border/40 flex-shrink-0 relative overflow-hidden group/img">
                        {notice.imageUrl ? (
                          <>
                            <Image
                              src={optimizeCloudinaryUrl(notice.imageUrl)}
                              alt="Notice Image"
                              fill
                              className="object-cover"
                            />
                            <button 
                              onClick={() => updateNoticeField(notice.id, "imageUrl", "")}
                              disabled={readOnly}
                              className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div 
                            onClick={() => {
                              if (readOnly) {
                                onLockedAction?.();
                                return;
                              }
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  const url = await handleFileUpload("bannerImage" as any, file);
                                  if (url) updateNoticeField(notice.id, "imageUrl", url);
                                }
                              };
                              input.click();
                            }}
                            className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="w-6 h-6 text-muted-foreground/30" />
                            <span className="text-xs text-muted-foreground/50">ছবি যোগ করুন</span>
                          </div>
                        )}
                      </div>
                      
                      <label className="text-xs font-bold text-muted-foreground block mt-2">ফাইল (PDF) - ঐচ্ছিক</label>
                      <div className="flex gap-2 items-center">
                         {notice.fileUrl ? (
                           <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex-1 overflow-hidden">
                             <FileText className="w-4 h-4 flex-shrink-0" />
                             <span className="text-xs truncate" title={notice.fileUrl}>ফাইল যুক্ত করা হয়েছে</span>
                             <button onClick={() => updateNoticeField(notice.id, "fileUrl", "")} className="ml-auto flex-shrink-0">
                               <X className="w-3 h-3 text-destructive" />
                             </button>
                           </div>
                         ) : (
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="w-full text-xs h-9 border-dashed"
                             onClick={() => {
                                if (readOnly) { onLockedAction?.(); return; }
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "application/pdf";
                                input.onchange = async (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    const url = await handleFileUpload("admissionFile" as any, file);
                                    if (url) updateNoticeField(notice.id, "fileUrl", url);
                                  }
                                };
                                input.click();
                             }}
                           >
                             <Upload className="w-3 h-3 mr-2" /> পিডিএফ যোগ করুন
                           </Button>
                         )}
                      </div>
                    </div>
                  </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};
