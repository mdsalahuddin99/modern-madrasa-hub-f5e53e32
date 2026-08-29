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
      <div className="absolute inset-0 z-0 opacity-10 islamic-pattern" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10" />

      <div className="container mx-auto px-6 sm:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">

          {/* Site Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group active-scale">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-accent transition-all duration-500">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">{f.siteName}</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed font-medium max-w-xs">
              {f.siteDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div className="hidden lg:block">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-8">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-accent transition-colors font-bold flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-8">আমাদের সেবাসমূহ</h4>
            <ul className="space-y-4">
              {(f.serviceLinks || []).map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-accent transition-colors font-bold group flex items-center justify-center md:justify-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-8">সরাসরি যোগাযোগ</h4>
            <ul className="space-y-6">
              {[
                { icon: Phone, text: f.phone, label: "ফোন করুন" },
                { icon: Mail, text: f.email, label: "ইমেইল পাঠান" },
                { icon: MapPin, text: f.address, label: "অফিস ঠিকানা" },
              ].map(({ icon: Icon, text, label }) => (
                <li key={text} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">{label}</p>
                    <span className="text-sm text-white/80 font-bold leading-snug break-words">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Centered & Refined */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>{f.copyright}</span>
          </div>

          <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/30">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-tighter">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-destructive animate-pulse fill-current" />
            <span>in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
