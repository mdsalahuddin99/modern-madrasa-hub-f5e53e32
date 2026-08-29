"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Award, Handshake, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toBn } from "@/lib/utils";

const CTASection = () => {
  const router = useRouter();
  const { content } = useSiteContent();
  const cta = content.cta;

  return (
    <section id="cta" className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Sharp technical background */}
      <div className="absolute inset-0 opacity-10"
           style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-8">
            <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Partner with us
            </div>
            <h2 className="text-4xl lg:text-7xl font-bold leading-[1.1] tracking-tighter">
              {cta.title} <br />
              <span className="opacity-60">{cta.titleLine2}</span>
            </h2>
            <p className="text-lg lg:text-xl opacity-80 max-w-xl font-medium leading-relaxed">
              {cta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto h-14 px-10 bg-white text-primary hover:bg-white/90 font-black uppercase text-xs tracking-widest rounded-none transition-all active:scale-[0.98]"
              >
                {cta.buttonText} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">১০০% ফ্রি — আজই যোগ দিন</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "সত্যায়িত প্রোফাইল" },
              { icon: Zap, label: "১ মিনিটে নিবন্ধন" },
              { icon: Award, label: "ফ্রি লিস্টিং" },
              { icon: Handshake, label: "নির্ভরযোগ্য তথ্য" },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                <item.icon className="w-6 h-6 text-white mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-black uppercase tracking-widest block">{item.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
