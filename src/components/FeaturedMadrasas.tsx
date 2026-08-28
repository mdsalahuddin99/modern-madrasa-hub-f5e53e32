"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Users, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import Image from "next/image";
import { Madrasa } from "@/data/madrasas";
import { SectionHeader } from "@/components/SectionHeader";

interface FeaturedMadrasasProps {
  featuredMadrasas?: Madrasa[];
}

const FeaturedMadrasas = ({ featuredMadrasas }: FeaturedMadrasasProps) => {
  const router = useRouter();
  const { content } = useSiteContent();
  const fc = content.featured;

  const featured = featuredMadrasas || [];

  const MadrasaCard = ({
    m,
    index = 0,
  }: {
    m: Madrasa;
    index?: number;
  }) => {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06, duration: 0.5 }}
        whileHover={{ y: -6 }}
        onClick={() => router.push(`/madrasas/${m.slug || m.id}`)}
        className="group cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-border/40 bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-400"
      >
        <div className="relative overflow-hidden aspect-[16/10]">
          <Image
            src={m.image}
            alt={m.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <Badge className="rounded-lg text-[10px] uppercase font-bold bg-white/15 text-white border-white/20 backdrop-blur-md mb-2">
              {m.category}
            </Badge>
            <h3 className="font-extrabold text-white leading-tight text-sm sm:text-base line-clamp-1">
              {m.name}
            </h3>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed font-medium">{m.description}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground font-medium mb-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              {m.district}, {m.division}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary shrink-0" />
              {m.students} ছাত্র
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              {m.established}
            </span>
          </div>
          <Button
            className="w-full rounded-xl text-sm font-bold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 py-6"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/madrasas/${m.slug || m.id}`);
            }}
          >
            {fc.detailsText} <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.article>
    );
  };

  return (
    <section id="featured" className="section-padding scroll-mt-24 bg-indigo-50/50 dark:bg-indigo-900/20">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <SectionHeader
            align="left"
            badge={fc.badge}
            badgeIcon={Star}
            title={fc.title}
            className="mb-0"
          />
          <Button
            variant="outline"
            className="hidden sm:flex rounded-2xl gap-2 shrink-0 border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => router.push("/madrasas")}
          >
            {fc.viewAllText} <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featured.map((m, i) => (
            <MadrasaCard key={m.id} m={m} index={i} />
          ))}
        </div>

        <div className="sm:hidden mt-6">
          <Button variant="outline" className="w-full rounded-2xl h-12" onClick={() => router.push("/madrasas")}>
            {fc.viewAllText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMadrasas;
