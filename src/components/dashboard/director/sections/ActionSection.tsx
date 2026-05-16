"use client";

import { CheckCircle2, Send, Share2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ActionSectionProps {
  isSubmitting: boolean;
  isLocked: boolean;
  isLoading: boolean;
  handleSubmit: () => void;
  shareUrl: string;
}

export const ActionSection = ({
  isSubmitting,
  isLocked,
  isLoading,
  handleSubmit,
  shareUrl,
}: ActionSectionProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("লিংক কপি হয়েছে!");
  };

  return (
    <div className="mt-8 border-t border-border/40 pt-8">
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || isLoading}
        className="w-full h-13 rounded-2xl shimmer-btn text-base font-bold gap-2"
      >
        {isSubmitting ? (
          "আপডেট হচ্ছে..."
        ) : isLocked ? (
          <>
            <Send className="w-5 h-5" /> সাবমিট ও পেমেন্ট করুন
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" /> তথ্য আপডেট করুন
          </>
        )}
      </Button>

      {!isLocked && (
        <div className="mt-5 glass-card rounded-2xl p-5 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">প্রোফাইল শেয়ার করুন</h3>
          </div>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="h-9 rounded-xl text-xs" />
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-9 rounded-xl text-xs">
              <Copy className="w-3.5 h-3.5" /> কপি
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
