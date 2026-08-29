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
    <section id="cta" className="py-12 lg:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="bg-primary rounded-[2rem] lg:rounded-[3rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/20 text-white">
          
          {/* Soft glowing orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

            {/* Left Content */}
            <div className="space-y-5 lg:space-y-8 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-xs font-bold mb-2 backdrop-blur-md border border-white/20 shadow-sm">
                <Handshake className="w-3.5 h-3.5 mr-2" /> আমাদের সাথে যুক্ত হোন
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
                {cta.title} <br />
                <span className="opacity-80 font-light">{cta.titleLine2}</span>
              </h2>
              
              <p className="text-base lg:text-lg opacity-80 max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
                {cta.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 pt-2">
                <Button
                  onClick={() => router.push("/signup")}
                  className="w-full sm:w-auto h-14 lg:h-16 px-10 bg-white text-primary hover:bg-white/90 font-bold text-base lg:text-lg rounded-full transition-all shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {cta.buttonText || "যুক্ত হোন"} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm font-bold opacity-80 bg-black/10 px-4 py-3 rounded-full w-full sm:w-auto">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  ১০০% ফ্রি — আজই যোগ দিন
                </div>
              </div>
            </div>

            {/* Right Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {[
                { icon: Shield, label: "সত্যায়িত প্রোফাইল", desc: "আপনার মাদ্রাসার তথ্য সুরক্ষিত" },
                { icon: Zap, label: "১ মিনিটে নিবন্ধন", desc: "খুব সহজে প্রোফাইল তৈরি" },
                { icon: Award, label: "ফ্রি লিস্টিং", desc: "কোনো হিডেন চার্জ নেই" },
                { icon: Handshake, label: "নির্ভরযোগ্য তথ্য", desc: "সঠিক ও যাচাইকৃত ডেটা" },
              ].map((item, i) => (
                <div key={i} className="p-6 lg:p-8 rounded-[1.5rem] bg-white text-foreground shadow-lg shadow-black/5 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                  <p className="text-xs font-medium text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
