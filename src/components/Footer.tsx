"use client";

import { BookOpen, Phone, Mail, MapPin, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

const Footer = () => {
  const { content } = useSiteContent();
  const f = content.footer;
  const navLinks = content.navbar.links;

  return (
    <footer className="relative bg-primary text-primary-foreground safe-bottom overflow-hidden pt-16 pb-24 md:pb-12">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">

          {/* Site Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-white group-hover:text-primary transition-all duration-500">
                <BookOpen className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">{f.siteName}</span>
            </Link>
            <p className="text-base text-white/80 leading-relaxed font-medium max-w-xs">
              {f.siteDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div className="hidden lg:block">
            <h4 className="text-lg font-bold text-white mb-6">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6">আমাদের সেবাসমূহ</h4>
            <ul className="space-y-4">
              {(f.serviceLinks || []).map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-base text-white/70 hover:text-white transition-colors font-medium group flex items-center justify-center md:justify-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
            <h4 className="text-lg font-bold text-white mb-6">সরাসরি যোগাযোগ</h4>
            <ul className="space-y-6">
              {[
                { icon: Phone, text: f.phone, label: "ফোন করুন" },
                { icon: Mail, text: f.email, label: "ইমেইল পাঠান" },
                { icon: MapPin, text: f.address, label: "অফিস ঠিকানা" },
              ].map(({ icon: Icon, text, label }) => (
                <li key={text} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white transition-colors">
                    <Icon className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white/50">{label}</p>
                    <span className="text-base text-white font-medium leading-snug break-words">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Centered & Refined */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white/60">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span>{f.copyright}</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</Link>
            <Link href="/terms" className="hover:text-white transition-colors">শর্তাবলী</Link>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-white/60">
            <span>তৈরি করা হয়েছে</span>
            <Heart className="w-3.5 h-3.5 text-white animate-pulse fill-current" />
            <span>বাংলাদেশে</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
