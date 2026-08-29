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
  <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
    {/* Background Image with Parallax-like effect */}
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
      style={{ backgroundImage: `url(${madrasa.image})` }}
    />

    {/* Dynamic Gradient Overlay for Native Feel */}
    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/60" />

    {/* Top Header Actions */}
    <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between safe-top">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active-scale"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active-scale">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active-scale">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content Container */}
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20">
      <div className="container mx-auto px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-accent text-white border-none font-black text-[10px] uppercase px-3 py-1 shadow-lg">
              {madrasa.category}
            </Badge>

            {madrasa.featured && (
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-white/10">
                <BadgeCheck className="w-3.5 h-3.5 text-accent" />
                <span>যাচাইকৃত</span>
              </div>
            )}

            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span>{madrasa.rating}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3 drop-shadow-md">
            {madrasa.name}
          </h1>

          <div className="flex items-center gap-2 text-white/90 font-bold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <span className="line-clamp-1">{madrasa.address}</span>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Subtle Islamic Pattern Overlay */}
    <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
  </section>
);

export default ProfileHero;
