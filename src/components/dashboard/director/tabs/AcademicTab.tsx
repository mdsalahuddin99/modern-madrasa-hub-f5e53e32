"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Trash2, CheckCircle2, BookOpen, Settings } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface AcademicTabProps {
  formData: any;
  updateDepartment: (index: number, field: string, value: string) => void;
  addDepartment: () => void;
  removeDepartment: (index: number) => void;
  updateCourse: (index: number, value: string) => void;
  addCourse: () => void;
  removeCourse: (index: number) => void;
  updateFacility: (index: number, value: string) => void;
  addFacility: () => void;
  removeFacility: (index: number) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const AcademicTab = ({
  formData,
  updateDepartment,
  addDepartment,
  removeDepartment,
  updateCourse,
  addCourse,
  removeCourse,
  updateFacility,
  addFacility,
  removeFacility,
  readOnly = false,
  onLockedAction,
}: AcademicTabProps) => {
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
      {/* 1. বিভাগসমূহ (Departments) */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            বিভাগসমূহ
          </h3>
          <Button variant="outline" size="sm" onClick={addDepartment} disabled={readOnly} className="gap-1.5 rounded-xl text-xs h-8">
            <Plus className="w-3.5 h-3.5" /> বিভাগ যোগ
          </Button>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {formData.departments.map((dept: any, i: number) => (
            <AccordionItem key={i} value={`dept-${i}`} className="border border-border/40 bg-muted/30 rounded-2xl px-4">
              <div className="flex items-center justify-between">
                <AccordionTrigger className="flex-1 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-3 text-sm font-bold text-left">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs">
                      বিভাগ
                    </span>
                    {dept.name || `বিভাগ ${i + 1}`}
                  </div>
                </AccordionTrigger>
                {formData.departments.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDepartment(i);
                    }}
                    disabled={readOnly}
                    className="h-8 w-8 rounded-full text-destructive/50 hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <AccordionContent className="pb-4">
                <div className="pt-2 border-t border-border/40 mt-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={dept.name}
                      onChange={(e) => updateDepartment(i, "name", e.target.value)}
                      disabled={readOnly}
                      placeholder="বিভাগের নাম"
                      className="flex-1 h-10 rounded-xl bg-background/60 border-border/50 text-sm font-bold"
                    />
                    <Input
                      value={dept.students}
                      onChange={(e) => updateDepartment(i, "students", e.target.value)}
                      disabled={readOnly}
                      placeholder="ছাত্র সংখ্যা"
                      className="w-24 h-10 rounded-xl bg-background/60 border-border/50 text-sm"
                    />
                  </div>
                  <Input
                    value={dept.desc}
                    onChange={(e) => updateDepartment(i, "desc", e.target.value)}
                    disabled={readOnly}
                    placeholder="বিভাগের সংক্ষিপ্ত বিবরণ (যেমন: নুরানী থেকে দাওরা হাদিস)"
                    className="h-10 rounded-xl bg-background/60 border-border/50 text-sm"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. কোর্সসমূহ (Courses) */}
        <div className="float-card bg-card rounded-2xl border border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              বিশেষ কোর্সসমূহ
            </h3>
            <Button variant="outline" size="sm" onClick={addCourse} disabled={readOnly} className="gap-1.5 rounded-xl text-xs h-8">
              <Plus className="w-3.5 h-3.5" /> যোগ করুন
            </Button>
          </div>
          <div className="space-y-2">
            {formData.courses.map((course: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <Input
                  value={course}
                  onChange={(e) => updateCourse(i, e.target.value)}
                  disabled={readOnly}
                  placeholder={`কোর্সের নাম (যেমন: হিফজুল কুরআন)`}
                  className="flex-1 h-10 rounded-xl bg-background/60 border-border/50 text-sm"
                />
                {formData.courses.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeCourse(i)} disabled={readOnly} className="h-9 w-9 text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. সুবিধাসমূহ (Facilities) */}
        <div className="float-card bg-card rounded-2xl border border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              অন্যান্য সুবিধাসমূহ
            </h3>
            <Button variant="outline" size="sm" onClick={addFacility} disabled={readOnly} className="gap-1.5 rounded-xl text-xs h-8">
              <Plus className="w-3.5 h-3.5" /> যোগ করুন
            </Button>
          </div>
          <div className="space-y-2">
            {(formData.facilities || []).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary/60" />
                </div>
                <Input
                  value={f}
                  onChange={(e) => updateFacility(i, e.target.value)}
                  disabled={readOnly}
                  placeholder={`যেমন: সমৃদ্ধ লাইব্রেরি`}
                  className="flex-1 h-10 rounded-xl bg-background/60 border-border/50 text-sm"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFacility(i)} disabled={readOnly} className="h-9 w-9 text-destructive/60 hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
