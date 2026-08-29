"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-[3rem] bg-accent/10 flex items-center justify-center mx-auto mb-10 border-4 border-white shadow-soft"
          >
            <AlertCircle className="w-16 h-16 text-accent" strokeWidth={2.5} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">পেজটি পাওয়া যায়নি</h1>
            <p className="text-muted-foreground font-medium mb-12 leading-relaxed">
              দুঃখিত, আপনি যে লিংকটি খুঁজছেন তা বর্তমানে আমাদের সার্ভারে নেই অথবা সরিয়ে ফেলা হয়েছে।
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Button asChild className="h-14 rounded-2xl bg-primary text-white font-black active-scale gap-2 shadow-lg shadow-primary/20">
              <Link href="/">
                <Home className="w-5 h-5" /> হোম পেজে ফিরে যান
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-14 rounded-2xl border-border/60 bg-white font-black active-scale gap-2">
              <Link href="/madrasas">
                <Search className="w-5 h-5" /> মাদ্রাসা খুঁজুন
              </Link>
            </Button>
          </motion.div>

          <p className="mt-12 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">
            Error Code: 404 • Madrasah Portal
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
