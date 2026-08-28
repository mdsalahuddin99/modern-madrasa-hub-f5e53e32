"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, Plus, Trash2, UserCircle, Upload, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { MadrasaFormData } from "@/types/madrasa";

interface StaffTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: any) => void;
  teachers: any[];
  updateTeacher: (teachers: any[]) => void;
  handleFileUpload: (field: any, file: File) => Promise<string | null>;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const StaffTab = ({ formData, update, teachers, updateTeacher, handleFileUpload, readOnly = false, onLockedAction }: StaffTabProps) => {
  const addTeacher = () => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    const newTeacher = {
      id: crypto.randomUUID(),
      name: "",
      designation: "",
      department: "",
      image: "",
      bio: "",
    };
    updateTeacher([...teachers, newTeacher]);
  };

  const removeTeacher = (id: string) => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    updateTeacher(teachers.filter((t) => t.id !== id));
  };

  const updateTeacherField = (id: string, field: string, value: any) => {
    if (readOnly) {
      onLockedAction?.();
      return;
    }
    updateTeacher(
      teachers.map((t) => (t.id === id ? { ...t, [field]: value } : t))
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
      {/* 1. সংখ্যাতাত্ত্বিক তথ্য (Counts) */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          শিক্ষার্থী ও প্রাক্তন ছাত্র তথ্য
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">মোট শিক্ষার্থী</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                type="number"
                value={formData.studentCount}
                onChange={(e) => update("studentCount", e.target.value)}
                disabled={readOnly}
                placeholder="যেমন: ৫০০"
                className="h-11 pl-10 rounded-xl bg-background/60 border-border/50 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">মোট শিক্ষক</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                type="number"
                value={formData.teacherCount}
                onChange={(e) => update("teacherCount", e.target.value)}
                disabled={readOnly}
                placeholder="যেমন: ৩০"
                className="h-11 pl-10 rounded-xl bg-background/60 border-border/50 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">প্রাক্তন ছাত্র</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                type="number"
                value={formData.alumniCount}
                onChange={(e) => update("alumniCount", e.target.value)}
                disabled={readOnly}
                placeholder="যেমন: ২০০০"
                className="h-11 pl-10 rounded-xl bg-background/60 border-border/50 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">উল্লেখযোগ্য প্রাক্তন ছাত্র</label>
          <Textarea
            value={formData.notableAlumni}
            onChange={(e) => update("notableAlumni", e.target.value)}
            disabled={readOnly}
            placeholder="বিখ্যাত বা সফল প্রাক্তন ছাত্রদের নাম ও পরিচয় লিখুন..."
            className="min-h-[100px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>
      </div>

      {/* 2. শিক্ষক ম্যানেজমেন্ট (Teacher Management) */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            শিক্ষক ও উলামায়ে কেরাম তালিকা
          </h3>
          <Button variant="outline" size="sm" onClick={addTeacher} disabled={readOnly} className="gap-2 rounded-xl h-9 px-4 border-primary/20 text-primary hover:bg-primary/5">
            <Plus className="w-4 h-4" /> শিক্ষক যোগ করুন
          </Button>
        </div>

        <div className="space-y-4">
          {teachers.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border/40">
              <UserCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">কোন শিক্ষক যুক্ত করা হয়নি</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {teachers.map((teacher, i) => (
                <AccordionItem key={teacher.id} value={teacher.id} className="border border-border/40 bg-muted/30 rounded-2xl px-4">
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="flex-1 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-3 text-sm font-bold text-left">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                          {teacher.image ? (
                            <Image src={optimizeCloudinaryUrl(teacher.image)} alt={teacher.name} width={32} height={32} className="object-cover w-full h-full" />
                          ) : (
                            <UserCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        {teacher.name || `শিক্ষক ${i + 1}`}
                      </div>
                    </AccordionTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTeacher(teacher.id);
                      }}
                      disabled={readOnly}
                      className="h-8 w-8 rounded-full text-destructive/50 hover:text-destructive hover:bg-destructive/10 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <AccordionContent className="pb-4">
                  <div className="pt-2 border-t border-border/40 mt-2 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-24 rounded-xl bg-background border border-border/40 flex-shrink-0 relative overflow-hidden group/img">
                        {teacher.image ? (
                          <>
                            <Image
                              src={optimizeCloudinaryUrl(teacher.image)}
                              alt={teacher.name}
                              fill
                              className="object-cover"
                            />
                            <button 
                              onClick={() => updateTeacherField(teacher.id, "image", "")}
                              disabled={readOnly}
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity"
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
                                  if (url) updateTeacherField(teacher.id, "image", url);
                                }
                              };
                              input.click();
                            }}
                            className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="w-5 h-5 text-muted-foreground/30" />
                            <span className="text-[10px] text-muted-foreground/50">ছবি</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <Input
                          value={teacher.name}
                          onChange={(e) => updateTeacherField(teacher.id, "name", e.target.value)}
                          disabled={readOnly}
                          placeholder="শিক্ষকের নাম"
                          className="h-9 rounded-lg bg-background/60 border-border/50 text-sm font-bold"
                        />
                        <Input
                          value={teacher.designation}
                          onChange={(e) => updateTeacherField(teacher.id, "designation", e.target.value)}
                          disabled={readOnly}
                          placeholder="পদবী (যেমন: সিনিয়র শিক্ষক)"
                          className="h-9 rounded-lg bg-background/60 border-border/50 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Input
                        value={teacher.department}
                        onChange={(e) => updateTeacherField(teacher.id, "department", e.target.value)}
                        disabled={readOnly}
                        placeholder="বিভাগ (যেমন: হিফজ বিভাগ)"
                        className="h-9 rounded-lg bg-background/60 border-border/50 text-xs"
                      />
                      <Textarea
                        value={teacher.bio}
                        onChange={(e) => updateTeacherField(teacher.id, "bio", e.target.value)}
                        disabled={readOnly}
                        placeholder="শিক্ষকের সংক্ষিপ্ত পরিচিতি..."
                        className="min-h-[60px] rounded-lg bg-background/60 border-border/50 text-xs resize-none"
                      />
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
