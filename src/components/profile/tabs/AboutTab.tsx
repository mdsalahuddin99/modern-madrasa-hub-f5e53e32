import { motion } from "framer-motion";
import { MessageSquareQuote, GraduationCap, Layers, CheckCircle2, BookOpen, Target, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";
import { ProfileContent } from "@/data/siteContent";
import { cn, toBn } from "@/lib/utils";

interface AboutTabProps {
  madrasa: Madrasa & {
    history?: string | null;
    mission?: string | null;
    vision?: string | null;
    principalMessage?: string | null;
    principalName?: string | null;
    principalRole?: string | null;
    departments?: any[];
    coreFeatures?: string[];
  };
  pc: ProfileContent;
}

const AboutTab = ({ madrasa, pc }: AboutTabProps) => {
  return (
    <div className="space-y-8">
      {/* Short Intro */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          {pc.sectionLabels.intro}
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed font-medium opacity-90">
          {madrasa.description}
        </p>
      </div>

      {/* History Card */}
      {madrasa.history && (
        <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-foreground">মাদ্রাসার ইতিহাস</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {madrasa.history}
          </p>
        </div>
      )}

      {/* Mission & Vision Grid */}
      {(madrasa.mission || madrasa.vision) && (
        <div id="mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
          {madrasa.mission && (
            <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg group hover:shadow-2xl hover:-translate-y-1 hover:border-accent/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <Target className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">আমাদের লক্ষ্য</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.mission}
              </p>
            </div>
          )}
          {madrasa.vision && (
            <div className="bg-white dark:bg-card/60 p-8 rounded-2xl border border-slate-100 dark:border-white/10 shadow-lg group hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <Eye className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">আমাদের দৃষ্টিভঙ্গি</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {madrasa.vision}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Principal's Message - Elegant Style */}
      <div id="director" className="bg-gradient-to-br from-primary/5 via-white dark:via-card/50 to-transparent p-8 sm:p-10 rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 scroll-mt-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />
        <MessageSquareQuote className="absolute top-8 right-8 w-20 h-20 text-primary/10 group-hover:text-primary/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700" />

        <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10 text-foreground">
           <div className="w-1.5 h-5 bg-accent rounded-full" />
           {pc.principalMessageTitle}
        </h2>

        <div className="relative pl-6 border-l-2 border-primary/40 z-10 mb-8">
          <p className="text-lg font-semibold leading-relaxed italic text-muted-foreground">
            &ldquo;{madrasa.principalMessage || pc.principalMessage}&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
          <div>
            <div className="text-base font-bold text-foreground">{madrasa.principalName || pc.principalName}</div>
            <div className="text-sm font-medium text-muted-foreground mt-0.5">{madrasa.principalRole || pc.principalRole}</div>
          </div>
        </div>
      </div>

      {/* Core Features / Why Choose Us */}
      {madrasa.coreFeatures && madrasa.coreFeatures.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
             <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
             কেন আমাদের জামিয়া?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {madrasa.coreFeatures.map((feature: string, idx: number) => (
               <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-card/60 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform shadow-sm mt-0.5">
                   <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
                 </div>
                 <span className="text-base font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{feature}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Facilities Widget - Redesigned */}
      {madrasa.facilities && madrasa.facilities.length > 0 && (
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              মাদ্রাসার সুবিধাসমূহ
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-1 ml-4 pl-0.5">এক নজরে আমাদের প্রধান সুবিধাসমূহ</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {madrasa.facilities.slice(0, 3).map((facility: string, idx: number) => (
              <div key={idx} className="group relative bg-white dark:bg-card/40 p-6 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-sm border border-primary/10">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-relaxed">{facility}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;

