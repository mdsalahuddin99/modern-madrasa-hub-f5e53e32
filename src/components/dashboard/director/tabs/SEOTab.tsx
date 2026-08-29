"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Globe, Key, FileText } from "lucide-react";
import { MadrasaFormData } from "@/types/madrasa";

interface SEOTabProps {
  formData: MadrasaFormData;
  update: (field: keyof MadrasaFormData, value: string) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const SEOTab = ({ formData, update, readOnly = false, onLockedAction }: SEOTabProps) => {
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">এসইও ও সার্চ ইঞ্জিন সেটিংস</h3>
            <p className="text-xs text-muted-foreground">আপনার মাদ্রাসাটি গুগল সার্চে খুঁজে পেতে সাহায্য করবে</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> মেটা টাইটেল (Meta Title)
            </label>
            <Input
              value={formData.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              disabled={readOnly}
              placeholder="যেমন: জামিয়া ইসলামিয়া - সেরা কওমি মাদ্রাসা"
              className="h-11 rounded-lg bg-background/60 border-border/50 focus:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground italic">গুগল সার্চে এই টাইটেলটি নীল রঙে দেখাবে। (৬০ অক্ষরের মধ্যে রাখা ভালো)</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> মেটা ডেসক্রিপশন (Meta Description)
            </label>
            <Textarea
              value={formData.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              disabled={readOnly}
              placeholder="আপনার মাদ্রাসা সম্পর্কে ১-২ লাইনের বিবরণ..."
              className="min-h-[100px] rounded-lg bg-background/60 border-border/50 text-sm resize-none"
            />
            <p className="text-[10px] text-muted-foreground italic">সার্চ রেজাল্টে টাইটেলের নিচে এই বর্ণনাটি দেখাবে। (১৬০ অক্ষরের মধ্যে)</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Key className="w-3.5 h-3.5" /> কী-ওয়ার্ডস (Keywords)
            </label>
            <Input
              value={formData.metaKeywords}
              onChange={(e) => update("metaKeywords", e.target.value)}
              disabled={readOnly}
              placeholder="যেমন: মাদ্রাসা, কওমি শিক্ষা, ঢাকা, ইসলামি শিক্ষা"
              className="h-11 rounded-lg bg-background/60 border-border/50 focus:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground italic">কমা দিয়ে আলাদা করে লিখুন।</p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">!</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary mb-1">সাব-ডোমেইন সেটিংস</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              আপনার মাদ্রাসার জন্য একটি আলাদা সাব-ডোমেইন (যেমন: <span className="font-mono text-primary">my-madrasa.modernmadrasahub.com</span>) 
              সেটআপ করতে আপনার সাবস্ক্রিপশন স্ট্যাটাস চেক করুন। এটি মাদ্রাসার ব্র্যান্ডিংয়ে সাহায্য করবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
