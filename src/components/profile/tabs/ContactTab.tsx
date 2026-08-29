"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, ChevronRight, Navigation } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Madrasa } from "@/data/madrasas";
import { cn } from "@/lib/utils";

const ContactTab = ({ madrasa }: { madrasa: Madrasa }) => {
  const contactItems = [
    { icon: Phone, label: "ফোন নম্বর", value: madrasa.phone, color: "text-primary", bg: "bg-primary/5" },
    { icon: Mail, label: "ইমেইল ঠিকানা", value: madrasa.email, color: "text-accent", bg: "bg-accent/5" },
    { icon: MapPin, label: "মাদ্রাসা ঠিকানা", value: madrasa.address, color: "text-primary", bg: "bg-primary/5" },
  ];

  const locationItems = [
    { label: "বিভাগ", value: madrasa.division },
    { label: "জেলা", value: madrasa.district },
    { label: "থানা", value: madrasa.thana },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-accent rounded-full" />
        <h3 className="text-xl font-black text-foreground">যোগাযোগ ও অবস্থান</h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-6 sm:p-10 space-y-2 relative z-10">
          {contactItems.map((item, idx) => (
            <div key={idx} className="group/item cursor-pointer">
              <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-3 shadow-sm", item.bg)}>
                  <item.icon className={cn("w-7 h-7", item.color)} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-base font-bold text-foreground break-words leading-tight group-hover/item:text-primary transition-colors">{item.value || "তথ্য নেই"}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
              </div>
              {idx < contactItems.length - 1 && <Separator className="my-2 bg-slate-100 dark:bg-white/10" />}
            </div>
          ))}

          {madrasa.website && (
            <>
              <Separator className="my-2 bg-slate-100 dark:bg-white/10" />
              <div className="group/item cursor-pointer">
                <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-3">
                    <Globe className="w-7 h-7 text-accent" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-1">অফিসিয়াল ওয়েবসাইট</p>
                    <a href={madrasa.website} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-primary truncate block group-hover/item:text-accent transition-colors">
                      {madrasa.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  <Navigation className="w-5 h-5 text-primary group-hover/item:text-accent group-hover/item:-translate-y-1 group-hover/item:translate-x-1 transition-all" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Location Summary Section */}
        <div className="bg-gradient-to-r from-primary/5 via-slate-50 dark:via-white/5 to-accent/5 px-6 py-8 border-t border-slate-100 dark:border-white/10 relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {locationItems.map((item) => (
              <div key={item.label} className="text-center p-3 rounded-2xl bg-white/50 dark:bg-card/40 shadow-sm border border-white/50 dark:border-white/5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1.5">{item.label}</p>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interactive Map Button Style Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden shadow-2xl shadow-primary/30 active-scale cursor-pointer group hover:-translate-y-1 transition-all duration-500">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xl font-black leading-tight mb-1">গুগল ম্যাপে দেখুন</h4>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">সহজে মাদ্রাসা খুঁজে পেতে</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center transition-all group-hover:bg-white group-hover:text-primary shadow-lg">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;

