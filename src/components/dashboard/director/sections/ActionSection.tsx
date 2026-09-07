"use client";

import { CheckCircle2, Send, Share2, Copy, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ActionSectionProps {
  isSubmitting: boolean;
  isLoading: boolean;
  handleSubmit: () => void;
  shareUrl: string;
}

export const ActionSection = ({
  isSubmitting,
  isLoading,
  handleSubmit,
  shareUrl,
}: ActionSectionProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("লিংক কপি হয়েছে!");
  };

  return (
    <div className="bg-background border-t border-border/40 p-4 -mx-4 md:-mx-6 mt-8">
      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading}
          className="flex-1 h-13 rounded-lg shimmer-btn text-base font-bold gap-2"
        >
          {isSubmitting ? (
            "আপডেট হচ্ছে..."
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" /> তথ্য আপডেট করুন
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open(`${shareUrl}?preview=true`, '_blank')}
          disabled={isSubmitting || isLoading}
          className="h-13 px-6 rounded-lg text-base font-bold gap-2 border-primary/20 hover:bg-primary/5"
        >
          <Eye className="w-5 h-5" /> প্রিভিউ দেখুন
        </Button>
      </div>

      <div className="mt-5 glass-card rounded-lg p-5 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">প্রোফাইল শেয়ার করুন</h3>
          </div>
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="h-9 rounded-lg text-xs" />
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-9 rounded-lg text-xs">
              <Copy className="w-3.5 h-3.5" /> কপি
            </Button>
          </div>
        </div>
    </div>
  );
};
