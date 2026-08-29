"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Users, Calendar, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSiteContent } from "@/hooks/useSiteContent";
import Image from "next/image";
import { Madrasa } from "@/data/madrasas";
import { SectionHeader } from "@/components/SectionHeader";
import { cn, toBn } from "@/lib/utils";

interface FeaturedMadrasasProps {
  featuredMadrasas?: Madrasa[];
}

const FeaturedMadrasas = ({ featuredMadrasas }: FeaturedMadrasasProps) => {
  const router = useRouter();
  const { content } = useSiteContent();
  const fc = content.featured;
  const featured = featuredMadrasas || [];

  const MadrasaCard = ({ m, index = 0 }: { m: Madrasa; index?: number }) => {
    return (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-card border border-border overflow-hidden active-press flex flex-col"
      >
        <Link href={`/madrasas/${m.slug || m.id}`} className="block flex-1">
          {/* Sharp Image Frame */}
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            {m.image ? (
              <Image
                src={m.image}
                alt={m.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-4xl uppercase opacity-10">
                {m.name.slice(0, 1)}
              </div>
            )}

            <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-3 py-1 font-black text-[9px] uppercase tracking-[0.2em] border-r border-b border-border">
              {m.category}
            </div>

            {m.featured && (
              <div className="absolute top-0 right-0 w-8 h-8 bg-foreground text-background flex items-center justify-center">
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          {/* Content Area - Modular and Spaced */}
          <div className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-tight tracking-tighter group-hover:text-primary transition-colors line-clamp-1">
                {m.name}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {m.district}, {m.division}
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">
              {m.description}
            </p>

            <div className="grid grid-cols-2 border-t border-border pt-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">Students</span>
                <span className="text-sm font-bold tabular-nums">{toBn(m.students)}</span>
              </div>
              <div className="space-y-1 border-l border-border pl-6">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block">Established</span>
                <span className="text-sm font-bold tabular-nums">{toBn(m.established || "—")}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Hover Action */}
        <div className="px-6 pb-6 lg:px-8 lg:pb-8">
           <div className="w-full h-10 border border-border bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
              <ArrowUpRight className="w-5 h-5" />
           </div>
        </div>
      </motion.article>
    );
  };

  return (
    <section id="featured" className="py-20 lg:py-32 bg-background border-b border-border overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-10">
          <SectionHeader
            align="left"
            badge="Selected"
            title="প্লাটফর্মের শীর্ষ মাদ্রাসাসমূহ"
            className="mb-0"
          />
          <button
            onClick={() => router.push("/madrasas")}
            className="px-8 py-3 bg-secondary text-foreground border border-border font-black uppercase text-[11px] tracking-[0.2em] hover:bg-primary hover:text-white transition-all active-press flex items-center gap-4"
          >
            {fc.viewAllText} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
          {featured.map((m, i) => (
            <div key={m.id} className="border-r border-b border-border p-4 lg:p-6 bg-background hover:bg-secondary/10 transition-colors">
              <MadrasaCard m={m} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default FeaturedMadrasas;
