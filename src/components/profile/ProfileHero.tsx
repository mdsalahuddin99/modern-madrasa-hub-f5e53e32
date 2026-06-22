import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Madrasa } from "@/data/madrasas";

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

interface ProfileHeroProps {
  madrasa: Madrasa;
  onBack: () => void;
}

const ProfileHero = ({ madrasa, onBack }: ProfileHeroProps) => (
  <section className="pt-20 pb-8 md:pt-28 md:pb-14 relative overflow-hidden">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${madrasa.image})` }}
    />
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
    {/* Pattern overlay */}
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
    <div className="container mx-auto px-4 relative z-10">
      <Button
        variant="ghost"
        className="text-white/70 hover:text-white hover:bg-white/10 gap-1.5 mb-4 md:mb-6 -ml-2 h-9 text-sm rounded-xl"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" /> তালিকায় ফিরুন
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <Badge className="bg-white/15 text-white border-0 rounded-lg text-xs px-2.5 py-1">
            {madrasa.category}
          </Badge>
          {madrasa.board && (
            <Badge className="bg-primary/30 text-white border-0 rounded-lg text-xs px-2.5 py-1">
              {madrasa.board}
            </Badge>
          )}
          <div className="flex items-center gap-1 bg-white/15 text-white px-2.5 py-1 rounded-lg text-xs">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-bold">{madrasa.rating}</span>
          </div>
          {madrasa.featured && (
            <div className="flex items-center gap-1 bg-accent/20 text-accent px-2.5 py-1 rounded-lg text-xs">
              <BadgeCheck className="w-3 h-3" />
              <span className="font-bold">যাচাইকৃত</span>
            </div>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-1.5 tracking-tight">
          {madrasa.name}
        </h1>
        <div className="flex items-center gap-1.5 text-white/70 text-sm">
          <MapPin className="w-3.5 h-3.5" />
          <span>{madrasa.address}</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProfileHero;
