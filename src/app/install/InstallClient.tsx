// ===================================================
// Install Client Component — PWA ইনস্টল লজিক
// ===================================================

"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallClient() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="pt-20 sm:pt-24 py-16 flex-grow">
        <div className="container mx-auto px-5">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 mb-8">
              <span className="text-4xl">📱</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
              অ্যাপ ইনস্টল করুন
            </h1>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
              মোবাইলে আরও ভালো অভিজ্ঞতার জন্য অ্যাপটি ইনস্টল করুন। ইন্টারনেট ছাড়াও অনেক ফিচার ব্যবহার করতে পারবেন।
            </p>

            {isInstalled ? (
              <div className="bg-card rounded-lg border p-6 text-center">
                <span className="text-4xl mb-3 block">✅</span>
                <h2 className="text-lg font-bold text-foreground mb-2">ইতিমধ্যে ইনস্টল করা হয়েছে!</h2>
                <p className="text-sm text-muted-foreground">আপনার হোম স্ক্রিন থেকে অ্যাপটি খুলুন।</p>
              </div>
            ) : isIOS ? (
              <div className="bg-card rounded-lg border p-6 text-left space-y-4">
                <h3 className="text-base font-bold text-foreground">iPhone / iPad এ ইনস্টল করুন:</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>১. Safari-এ <strong className="text-foreground">Share</strong> বাটনে ট্যাপ করুন</p>
                  <p>২. <strong className="text-foreground">&quot;Add to Home Screen&quot;</strong> নির্বাচন করুন</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                disabled={!deferredPrompt}
                className="px-10 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary disabled:opacity-50 transition text-sm"
              >
                {deferredPrompt ? "⬇️ এখনই ইনস্টল করুন" : "ব্রাউজার মেনু থেকে ইনস্টল করুন"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
