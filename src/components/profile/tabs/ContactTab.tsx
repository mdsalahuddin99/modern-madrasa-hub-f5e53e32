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
        className="bg-card rounded-[2.5rem] border border-border/40 shadow-soft overflow-hidden"
      >
        <div className="p-6 sm:p-8 space-y-6">
          {contactItems.map((item, idx) => (
            <div key={idx} className="group cursor-pointer active-scale">
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-6 h-6", item.color)} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-foreground break-words leading-tight">{item.value || "তথ্য নেই"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 mt-4" />
              </div>
              {idx < contactItems.length - 1 && <Separator className="mt-6 bg-border/40" />}
            </div>
          ))}

          {madrasa.website && (
            <>
              <Separator className="bg-border/40" />
              <div className="group cursor-pointer active-scale flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-accent" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">অফিসিয়াল ওয়েবসাইট</p>
                  <a href={madrasa.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary truncate block">
                    {madrasa.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
                <Navigation className="w-4 h-4 text-primary" />
              </div>
            </>
          )}
        </div>

        {/* Location Summary Section */}
        <div className="bg-secondary/30 px-6 py-8 border-t border-border/40">
          <div className="grid grid-cols-3 gap-4">
            {locationItems.map((item) => (
              <div key={item.label} className="text-center p-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">{item.label}</p>
                <p className="text-xs font-black text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interactive Map Button Style Callout */}
      <div className="p-8 rounded-[2.5rem] bg-primary text-white relative overflow-hidden shadow-2xl shadow-primary/20 active-scale cursor-pointer group">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <MapPin className="w-6 h-6 text-accent" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-lg font-black leading-tight">গুগল ম্যাপে দেখুন</h4>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-0.5">সহজে মাদ্রাসা খুঁজে পেতে</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-accent group-hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
