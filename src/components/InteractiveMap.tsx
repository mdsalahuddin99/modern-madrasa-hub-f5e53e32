"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, Users, ArrowUpRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Low-poly coordinates representing the actual geographic shape of Bangladesh's 8 divisions (viewBox 0 0 500 600)
const divisions = [
  { id: "rangpur", name: "রংপুর", nameEn: "Rangpur", poly: "130,50 180,50 200,100 170,160 110,130", cx: 155, cy: 100, stats: { madrasas: 340, students: "১২,০০০+" } },
  { id: "mymensingh", name: "ময়মনসিংহ", nameEn: "Mymensingh", poly: "180,50 260,60 280,120 220,180 200,100", cx: 230, cy: 110, stats: { madrasas: 420, students: "১৫,৫০০+" } },
  { id: "sylhet", name: "সিলেট", nameEn: "Sylhet", poly: "260,60 360,60 400,120 340,200 280,120", cx: 330, cy: 110, stats: { madrasas: 280, students: "৯,৮০০+" } },
  { id: "rajshahi", name: "রাজশাহী", nameEn: "Rajshahi", poly: "110,130 170,160 190,240 140,290 80,240", cx: 140, cy: 210, stats: { madrasas: 480, students: "১৭,২০০+" } },
  { id: "dhaka", name: "ঢাকা", nameEn: "Dhaka", poly: "190,240 170,160 200,100 220,180 280,120 340,200 320,280 240,320", cx: 250, cy: 220, stats: { madrasas: 1250, students: "৪৫,০০০+" } },
  { id: "khulna", name: "খুলনা", nameEn: "Khulna", poly: "80,240 140,290 190,240 240,320 200,420 120,440", cx: 160, cy: 330, stats: { madrasas: 390, students: "১৪,১০০+" } },
  { id: "barisal", name: "বরিশাল", nameEn: "Barisal", poly: "240,320 320,280 300,380 240,440 200,420", cx: 255, cy: 360, stats: { madrasas: 310, students: "১০,৫০০+" } },
  { id: "chittagong", name: "চট্টগ্রাম", nameEn: "Chittagong", poly: "320,280 340,200 400,120 440,200 420,320 460,500 380,520 300,380", cx: 380, cy: 330, stats: { madrasas: 850, students: "৩১,০০০+" } },
];

const connections = [
  ["rangpur", "rajshahi"],
  ["rangpur", "mymensingh"],
  ["mymensingh", "sylhet"],
  ["mymensingh", "dhaka"],
  ["rajshahi", "dhaka"],
  ["rajshahi", "khulna"],
  ["dhaka", "khulna"],
  ["dhaka", "barisal"],
  ["dhaka", "chittagong"],
  ["khulna", "barisal"],
  ["barisal", "chittagong"],
  ["sylhet", "chittagong"],
];

const InteractiveMap = () => {
  const [activeDiv, setActiveDiv] = useState<number>(4); // Dhaka default
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isHovered) {
      autoPlayRef.current = setInterval(() => {
        setActiveDiv((prev) => (prev + 1) % divisions.length);
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered]);

  const activeNode = divisions[activeDiv];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
          
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-5">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-bold">সারাদেশে আমাদের নেটওয়ার্ক</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-[1.15] tracking-tight z-10 relative">
                ৮টি বিভাগেই রয়েছে <br className="hidden sm:block" />
                <span className="text-primary relative inline-block whitespace-nowrap mt-2">
                  সত্যায়িত মাদ্রাসা
                  <svg className="absolute w-full h-[14px] sm:h-4 -bottom-1.5 sm:-bottom-2 left-0 text-primary/70 -z-10" viewBox="0 0 100 15" preserveAspectRatio="none">
                    <path d="M3,12 Q50,2 97,10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                টেকনাফ থেকে তেঁতুলিয়া— দেশের প্রতিটি প্রান্তের কওমি মাদ্রাসার সঠিক তথ্য এখন এক ক্লিকেই আপনার হাতের মুঠোয়। ইন্টারঅ্যাক্টিভ ম্যাপ থেকে আপনার কাঙ্ক্ষিত বিভাগের তথ্য এক্সপ্লোর করুন.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1 tabular-nums">৪,২০০<span className="text-primary">+</span></p>
                <p className="text-sm text-muted-foreground font-medium">মোট তালিকাভুক্ত</p>
              </div>
              <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1 tabular-nums">১.২<span className="text-primary">লাখ+</span></p>
                <p className="text-sm text-muted-foreground font-medium">শিক্ষার্থী</p>
              </div>
            </div>

            <Button className="h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
              সকল মাদ্রাসা দেখুন <ArrowUpRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* RIGHT: INTERACTIVE MAP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[550px] sm:h-[650px] w-full flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* SVG Network Map */}
            <svg viewBox="0 0 500 600" className="w-full h-full overflow-visible drop-shadow-2xl pt-10 pl-10">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </radialGradient>
                <filter id="3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Draw Nodes (Divisions) */}
              {divisions.map((div, i) => {
                const isActive = activeDiv === i;
                return (
                  <g 
                    key={div.id} 
                    className="cursor-pointer" 
                    onClick={() => setActiveDiv(i)}
                  >
                    <motion.polygon
                      points={div.poly}
                      fill={isActive ? "var(--primary)" : "hsl(var(--background))"}
                      stroke="var(--primary)"
                      strokeWidth={isActive ? 2.5 : 1}
                      strokeLinejoin="round"
                      filter="url(#3d-shadow)"
                      className="transition-all duration-300 origin-center"
                      animate={isActive ? { 
                        scale: 1.05, 
                        y: -10,
                        fillOpacity: 1
                      } : { 
                        scale: 1, 
                        y: 0,
                        fillOpacity: 0.9
                      }}
                      whileHover={{ scale: 1.02, y: -4, fillOpacity: 0.95 }}
                      style={{
                        transformOrigin: `${div.cx}px ${div.cy}px`
                      }}
                    />
                    
                    {isActive && (
                      <motion.circle
                        cx={div.cx}
                        cy={div.cy - 10}
                        r={40}
                        fill="url(#glow)"
                        className="pointer-events-none"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    
                    <text
                      x={div.cx}
                      y={div.cy + (isActive ? -6 : 4)}
                      textAnchor="middle"
                      className={`text-[12px] sm:text-[14px] font-extrabold transition-all duration-300 pointer-events-none ${isActive ? "fill-primary-foreground drop-shadow-md" : "fill-primary"}`}
                    >
                      {div.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Info Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="absolute z-20"
                style={{
                  left: `calc(50% - 250px + ${activeNode.cx}px + 50px)`, // Offset from the poly center
                  top: `calc(50% - 300px + ${activeNode.cy}px - 80px)`,
                  transformOrigin: "bottom left"
                }}
              >
                {/* SVG Pointer line */}
                <svg className="absolute -bottom-8 -left-8 w-12 h-12 pointer-events-none" viewBox="0 0 50 50">
                  <path 
                    d="M 50 0 Q 25 25 0 50" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="1.5"
                    strokeDasharray="4 4" 
                  />
                  <circle cx="50" cy="0" r="3" fill="var(--primary)" />
                </svg>

                <div className="bg-background/80 backdrop-blur-xl border border-border shadow-2xl shadow-primary/10 rounded-2xl p-4 w-48 sm:w-56 pointer-events-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-foreground text-sm sm:text-base">{activeNode.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{activeNode.nameEn} Division</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">তালিকাভুক্ত:</span>
                      <span className="font-bold text-foreground tabular-nums">{activeNode.stats.madrasas}টি</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">শিক্ষার্থী:</span>
                      <span className="font-bold text-foreground tabular-nums">{activeNode.stats.students}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="w-full mt-3 h-8 text-[10px] sm:text-xs text-primary bg-primary/5 hover:bg-primary/10">
                    বিস্তারিত দেখুন <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
