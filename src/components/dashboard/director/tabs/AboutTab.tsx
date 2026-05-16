import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Layers, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { MadrasaFormData } from "@/types/madrasa";

interface AboutTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: any) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const AboutTab = ({
  formData,
  update,
  readOnly = false,
  onLockedAction,
}: AboutTabProps) => {
  return (
    <div className="space-y-5 relative">
      {readOnly && (
        <button
          type="button"
          aria-label="লকড ফিচার"
          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
          onClick={onLockedAction}
        />
      )}
      {/* 1. পরিচিতি ও ইতিহাস */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-5 space-y-4">
        <h3 className="text-base font-bold text-foreground">প্রতিষ্ঠান পরিচিতি</h3>
        
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">সংক্ষিপ্ত বিবরণ</label>
          <Textarea
            value={formData.description}
            onChange={(e) => update("description", e.target.value)}
            disabled={readOnly}
            placeholder="আপনার মাদ্রাসা সম্পর্কে সংক্ষিপ্ত বিবরণ..."
            className="min-h-[80px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">ইতিহাস</label>
          <Textarea
            value={formData.history}
            onChange={(e) => update("history", e.target.value)}
            disabled={readOnly}
            placeholder="প্রতিষ্ঠানের সংক্ষিপ্ত ইতিহাস লিখুন..."
            className="min-h-[100px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>
      </div>

      {/* 2. মুহতামিমের বাণী (Principal's Message) */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[60px]" />
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquareQuote className="w-4.5 h-4.5 text-primary" />
          মুহতামিমের বাণী
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">বাণী / মেসেজ</label>
            <Textarea
              value={formData.principalMessage}
              onChange={(e) => update("principalMessage", e.target.value)}
              disabled={readOnly}
              placeholder="মুহতামিম সাহেবের বাণী লিখুন..."
              className="min-h-[100px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">নাম</label>
              <Input
                value={formData.principalName}
                onChange={(e) => update("principalName", e.target.value)}
                disabled={readOnly}
                placeholder="মুহতামিম সাহেবের নাম"
                className="h-10 rounded-xl bg-background/60 border-border/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">পদবী</label>
              <Input
                value={formData.principalRole}
                onChange={(e) => update("principalRole", e.target.value)}
                disabled={readOnly}
                placeholder="যেমন: প্রধান পরিচালক"
                className="h-10 rounded-xl bg-background/60 border-border/50 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* মিশন ও ভিশন */}
      <div className="float-card bg-card rounded-2xl border border-border/60 p-5 space-y-3">
        <h3 className="text-base font-bold text-foreground">মিশন ও ভিশন</h3>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">মিশন</label>
          <Textarea
            value={formData.mission}
            onChange={(e) => update("mission", e.target.value)}
            disabled={readOnly}
            placeholder="আপনার প্রতিষ্ঠানের লক্ষ্য..."
            className="min-h-[70px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">ভিশন</label>
          <Textarea
            value={formData.vision}
            onChange={(e) => update("vision", e.target.value)}
            disabled={readOnly}
            placeholder="ভবিষ্যৎ পরিকল্পনা..."
            className="min-h-[70px] rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};
