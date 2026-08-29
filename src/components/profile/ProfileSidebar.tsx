import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Navigation, ChevronRight, Calendar, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Madrasa } from "@/data/madrasas";
import { cn, toBn } from "@/lib/utils";

const ProfileSidebar = ({ madrasa }: { madrasa: Madrasa & { contents?: any[] } }) => {
  const contactItems = [
    { icon: Phone, label: "ফোন নম্বর", value: madrasa.phone, color: "text-primary", bg: "bg-primary/5" },
    { icon: Mail, label: "ইমেইল ঠিকানা", value: madrasa.email, color: "text-accent", bg: "bg-accent/5" },
    { icon: MapPin, label: "মাদ্রাসা লোকেশন", value: madrasa.address, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <div className="space-y-3 sticky top-28">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-card/60 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-lg overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h3 className="text-xl font-black text-foreground mb-3 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-accent rounded-full" />
             যোগাযোগের তথ্য
          </h3>

        <div className="space-y-2">
          {contactItems.map((item, idx) => (
            <div key={idx} className="group/item cursor-pointer">
              <div className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-3 shadow-sm", item.bg)}>
                  <item.icon className={cn("w-3.5 h-3.5", item.color)} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-xs font-bold text-foreground break-words leading-tight group-hover/item:text-primary transition-colors">{item.value || "তথ্য নেই"}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
              </div>
              {idx < contactItems.length - 1 && <Separator className="my-1.5 bg-slate-100 dark:bg-white/10" />}
            </div>
          ))}

          {madrasa.website && (
            <>
              <Separator className="my-1.5 bg-slate-100 dark:bg-white/10" />
              <div className="group/item cursor-pointer">
                <div className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover/item:scale-110 group-hover/item:-rotate-3">
                    <Globe className="w-3.5 h-3.5 text-accent" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">ওয়েবসাইট</p>
                    <a href={madrasa.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary truncate block group-hover/item:text-accent transition-colors">
                      {madrasa.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  <Navigation className="w-4 h-4 text-primary group-hover/item:text-accent group-hover/item:-translate-y-1 group-hover/item:translate-x-1 transition-all" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Location Badge */}
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 via-slate-50 dark:via-white/5 to-accent/5 border border-slate-100 dark:border-white/10 shadow-sm">
           <div className="flex items-center justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
              <span>{madrasa.division}</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary/40" />
              <span>{madrasa.district}</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary/40" />
              <span>{madrasa.thana}</span>
           </div>
        </div>
        </div>
      </motion.div>

      {/* Recent Notices Section */}
      {madrasa.contents && madrasa.contents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-card/60 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-lg overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-foreground mb-3 flex items-center gap-3">
               <div className="w-1.5 h-6 bg-primary rounded-full" />
               সাম্প্রতিক নোটিশ
            </h3>
            
            <div className="space-y-3">
              {madrasa.contents?.slice(0, 3).map((item: any, idx: number) => (
                <div key={idx} className="group/notice cursor-pointer">
                  <div className="flex flex-col gap-1 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/10">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                       <Calendar className="w-3 h-3 text-primary/70" />
                       {toBn(new Date(item.createdAt).toLocaleDateString("bn-BD", { day: 'numeric', month: 'short' }))}
                       {idx === 0 && (
                         <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded-full text-[8px] animate-pulse">নতুন</span>
                       )}
                    </div>
                    <h4 className="text-xs font-bold text-foreground leading-tight group-hover/notice:text-primary transition-colors line-clamp-2">
                       {item.title}
                    </h4>
                  </div>
                  {idx < Math.min(madrasa.contents?.length || 0, 3) - 1 && <Separator className="my-1.5 bg-slate-100 dark:bg-white/10" />}
                </div>
              ))}
            </div>
            
            {(madrasa.contents?.length || 0) > 3 && (
              <button 
                onClick={() => {
                  const element = document.getElementById("notices");
                  if (element) {
                    const y = element.getBoundingClientRect().top + window.scrollY - 130;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="w-full mt-3 py-2 rounded-xl bg-primary/5 text-primary text-[10px] font-bold hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
              >
                সব নোটিশ দেখুন <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

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

