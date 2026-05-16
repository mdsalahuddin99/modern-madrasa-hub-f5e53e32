"use client";

import { BookOpen, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const { content } = useSiteContent();
  const f = content.footer;
  const navLinks = content.navbar.links;

  return (
    <footer className="relative bg-foreground safe-bottom overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-16 sm:py-20">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 rounded-2xl gradient-btn flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-base font-extrabold text-background">{f.siteName}</span>
            </Link>
            <p className="text-xs sm:text-sm text-background/35 leading-relaxed max-w-[260px]">{f.siteDescription}</p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold/70 font-bold mb-6">{f.linksTitle}</h4>
            <ul className="space-y-3.5">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/45 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold/70 font-bold mb-6">{f.servicesTitle}</h4>
            <ul className="space-y-3.5">
              {(f.serviceLinks || []).map((link, idx) => (
                <li key={idx}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-sm text-background/45 hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-background/45 hover:text-background transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold/70 font-bold mb-6">{f.contactTitle}</h4>
            <ul className="space-y-4 text-sm text-background/45">
              {[
                { icon: Phone, text: f.phone },
                { icon: Mail, text: f.email },
                { icon: MapPin, text: f.address },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-background/8 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-gold/70" />
                  </div>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-background/25">{f.copyright}</p>
          <p className="text-[11px] text-background/20">বাংলাদেশের কওমি মাদ্রাসা ডিরেক্টরি</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
