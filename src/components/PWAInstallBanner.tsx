"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallBanner = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a delay for non-intrusive UX
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For iOS, show after delay anyway
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setTimeout(() => setShow(true), 5000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShow(false);
      setDeferredPrompt(null);
    } else {
      router.push("/install");
    }
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-4 left-4 right-4 z-50 safe-bottom md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="glass-card rounded-2xl p-4 shadow-2xl border border-border/40">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground mb-0.5">অ্যাপটি ইনস্টল করুন</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  হোম স্ক্রিনে যুক্ত করে নেটিভ অ্যাপের মতো ব্যবহার করুন
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <Button size="sm" onClick={handleInstall} className="h-8 text-xs rounded-xl shimmer-btn gap-1.5">
                    <Download className="w-3 h-3" /> ইনস্টল
                  </Button>
                  <Button size="sm" variant="ghost" onClick={dismiss} className="h-8 text-xs rounded-xl text-muted-foreground">
                    পরে
                  </Button>
                </div>
              </div>
              <button onClick={dismiss} className="p-1 rounded-lg hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallBanner;
