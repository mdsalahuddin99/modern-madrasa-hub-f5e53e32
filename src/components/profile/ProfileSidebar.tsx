import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Navigation, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Madrasa } from "@/data/madrasas";
import { cn } from "@/lib/utils";

const ProfileSidebar = ({ madrasa }: { madrasa: Madrasa }) => {
  const contactItems = [
    { icon: Phone, label: "ফোন নম্বর", value: madrasa.phone, color: "text-primary", bg: "bg-primary/5" },
    { icon: Mail, label: "ইমেইল ঠিকানা", value: madrasa.email, color: "text-accent", bg: "bg-accent/5" },
    { icon: MapPin, label: "মাদ্রাসা লোকেশন", value: madrasa.address, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-[2rem] p-6 sm:p-8 border border-border/40 shadow-soft sticky top-24"
      >
        <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
           <div className="w-1.5 h-5 bg-accent rounded-full" />
           যোগাযোগের তথ্য
        </h3>

        <div className="space-y-5">
          {contactItems.map((item, idx) => (
            <div key={idx} className="group cursor-pointer active-scale">
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-foreground break-words leading-tight">{item.value || "তথ্য নেই"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 mt-4" />
              </div>
              {idx < contactItems.length - 1 && <Separator className="mt-5 bg-border/40" />}
            </div>
          ))}

          {madrasa.website && (
            <>
              <Separator className="bg-border/40" />
              <div className="group cursor-pointer active-scale flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-accent/5 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-accent" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">ওয়েবসাইট</p>
                  <a href={madrasa.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary truncate block">
                    {madrasa.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
                <Navigation className="w-4 h-4 text-primary" />
              </div>
            </>
          )}
        </div>

        {/* Quick Location Badge */}
        <div className="mt-8 p-4 rounded-2xl bg-secondary/30 border border-border/40">
           <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter text-muted-foreground">
              <span>{madrasa.division}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{madrasa.district}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{madrasa.thana}</span>
           </div>
        </div>
      </motion.div>

      {/* Floating Action Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-24 right-6 z-40">
         <button className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active-scale border-4 border-white">
            <Phone className="w-6 h-6 fill-current" />
         </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
