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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group bg-white rounded-[2rem] p-4 md:p-5 shadow-xl shadow-black/5 border border-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
      >
        <Link href={`/madrasas/${m.slug || m.id}`} className="flex flex-col flex-1 h-full">
          {/* Soft Image Frame */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAFAFA] mb-5 shrink-0">
            {m.image ? (
              <Image
                src={m.image}
                alt={m.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-5xl text-primary/10">
                {m.name.slice(0, 1)}
              </div>
            )}

            {/* Category Pill */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full font-bold text-xs shadow-sm">
              {m.category}
            </div>

            {/* Featured Star */}
            {m.featured && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30">
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="px-2 flex flex-col flex-1">
            <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] mb-3">
              {m.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="truncate">{m.district}, {m.division}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.75rem] mb-0">
              {m.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-black/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                     <Users className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <div className="text-[10px] text-muted-foreground font-bold">শিক্ষার্থী</div>
                     <div className="text-sm font-bold tabular-nums leading-none mt-0.5">{toBn(m.students)}</div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                     <Calendar className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <div className="text-[10px] text-muted-foreground font-bold">স্থাপিত</div>
                     <div className="text-sm font-bold tabular-nums leading-none mt-0.5">{toBn(m.established || "—")}</div>
                   </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="w-10 h-10 rounded-full bg-primary shadow-sm shadow-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/40 transition-all shrink-0">
                 <ArrowUpRight className="w-4 h-4 text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  };

  return (
    <section id="featured" className="py-2 lg:py-8 bg-[#FAFAFA] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 lg:mb-12 gap-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white text-primary rounded-full text-xs font-bold mb-4 shadow-sm border border-black/5">
              <Star className="w-3.5 h-3.5 mr-2" /> ফিচারড মাদ্রাসা
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              প্লাটফর্মের <span className="text-primary font-light">শীর্ষ মাদ্রাসাসমূহ</span>
            </h2>
          </div>
          
          <button
            onClick={() => router.push("/madrasas")}
            className="group px-6 py-3 bg-white text-foreground border border-black/5 rounded-full font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md shadow-black/5 flex items-center gap-3"
          >
            {fc.viewAllText || "সবগুলো দেখুন"} 
            <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {featured.map((m, i) => (
            <MadrasaCard key={m.id} m={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default FeaturedMadrasas;
