import { motion } from "framer-motion";
import { Link2, Share2, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareSectionProps {
  madrasaName: string;
  madrasaId: string;
}

const ShareSection = ({ madrasaName, madrasaId }: ShareSectionProps) => {
  const profileUrl = `${window.location.origin}/madrasas/${madrasaId}`;
  const shareText = `${madrasaName} — কওমি মাদ্রাসা ডিরেক্টরি`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("লিংক কপি হয়েছে!");
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${profileUrl}`)}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: madrasaName, text: shareText, url: profileUrl });
      } catch (error) {
        console.error("Native share failed:", error);
      }
    } else {
      copyLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="float-card bg-card rounded-2xl border border-border/60 p-5 md:p-6"
    >
      <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-primary" />
        প্রোফাইল শেয়ার করুন
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5 rounded-xl text-xs h-9">
          <Link2 className="w-3.5 h-3.5" /> লিংক কপি
        </Button>
        <Button variant="outline" size="sm" onClick={shareToFacebook} className="gap-1.5 rounded-xl text-xs h-9">
          <Facebook className="w-3.5 h-3.5" /> ফেসবুক
        </Button>
        <Button variant="outline" size="sm" onClick={shareToWhatsApp} className="gap-1.5 rounded-xl text-xs h-9">
          <MessageCircle className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপ
        </Button>
        <Button variant="outline" size="sm" onClick={nativeShare} className="gap-1.5 rounded-xl text-xs h-9">
          <Share2 className="w-3.5 h-3.5" /> শেয়ার
        </Button>
      </div>
    </motion.div>
  );
};

export default ShareSection;
