import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, BadgeCheck, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";
import { cn } from "@/lib/utils";

interface ProfileHeroProps {
  madrasa: Madrasa;
  onBack: () => void;
}

const ProfileHero = ({ madrasa, onBack }: ProfileHeroProps) => (
  <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
    {/* Background Image with Parallax-like effect */}
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-110"
      style={{ backgroundImage: `url(${madrasa.image})` }}
    />

    {/* Dynamic Gradient Overlay for Premium Look */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-black/30" />
    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay pointer-events-none" />

    {/* Top Header Actions */}
    <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between safe-top">
      <button
        onClick={onBack}
        className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-3">
        <button className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg group">
          <Share2 className="w-4 h-4 group-hover:text-primary transition-colors" />
        </button>
        <button className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg group">
          <Heart className="w-4 h-4 group-hover:fill-accent group-hover:text-accent transition-colors" />
        </button>
      </div>
    </div>

    {/* Content Container */}
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 pb-20 md:pb-28 lg:pb-36 z-20">
      <div className="container mx-auto px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-4 py-1.5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] backdrop-blur-md rounded-full">
              {madrasa.category}
            </Badge>

            {madrasa.featured && (
              <div className="flex items-center gap-1.5 bg-accent/20 backdrop-blur-xl text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold border border-accent/30 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                <BadgeCheck className="w-4 h-4 text-accent" />
                <span>যাচাইকৃত</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/30 shadow-lg">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{madrasa.rating}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-5 drop-shadow-lg [text-wrap:balance]">
            {madrasa.name}
          </h1>

          <div className="flex items-center gap-3 text-white/95 font-medium text-base sm:text-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shrink-0 shadow-lg">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <span className="line-clamp-1 drop-shadow-md">{madrasa.address}</span>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Subtle Islamic Pattern Overlay */}
    <div className="absolute inset-0 opacity-[0.05] islamic-pattern pointer-events-none mix-blend-overlay" />
  </section>
);

export default ProfileHero;
