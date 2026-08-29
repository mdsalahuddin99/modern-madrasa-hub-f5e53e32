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
    <section className="section-padding bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden">
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
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-[1.15] tracking-tight z-10 relative lg:whitespace-nowrap">
                ৮টি বিভাগেই রয়েছে <br className="hidden lg:hidden sm:block" />
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
              <div className="float-card p-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1 tabular-nums">৪,২০০<span className="text-primary">+</span></p>
                <p className="text-sm text-muted-foreground font-medium">মোট তালিকাভুক্ত</p>
              </div>
              <div className="float-card p-5 rounded-lg bg-amber-50 dark:bg-amber-950/40">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1 tabular-nums">১.২<span className="text-amber-600 dark:text-amber-400">লাখ+</span></p>
                <p className="text-sm text-muted-foreground font-medium">শিক্ষার্থী</p>
              </div>
            </div>

            <Button className="h-14 px-8 rounded-lg text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
              সকল মাদ্রাসা দেখুন <ArrowUpRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* RIGHT: INTERACTIVE MAP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[500px] aspect-[5/6] mx-auto flex items-center justify-center mt-8 lg:mt-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* SVG Network Map */}
            <svg viewBox="0 0 500 600" className="w-full h-full overflow-visible drop-shadow-2xl">
              <defs>
                <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
                </radialGradient>
                <filter id="3d-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
                </filter>
                <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="hsl(var(--destructive))" floodOpacity="0.8" />
                  <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="hsl(var(--destructive))" floodOpacity="0.5" />
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
                      fill={isActive ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                      stroke={isActive ? "hsl(var(--background))" : "hsl(var(--background))"}
                      strokeWidth={isActive ? 2.5 : 1}
                      strokeLinejoin="round"
                      filter={isActive ? "url(#neon-glow)" : "url(#3d-shadow)"}
                      className="transition-all duration-300 origin-center"
                      animate={isActive ? { 
                        scale: 1.05, 
                        y: -10,
                        fillOpacity: 1
                      } : { 
                        scale: 1, 
                        y: 0,
                        fillOpacity: 0.8
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
                        fill="url(#glow-red)"
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
                      className={`text-[12px] sm:text-[14px] font-extrabold transition-all duration-300 pointer-events-none ${isActive ? "fill-destructive-foreground drop-shadow-md" : "fill-primary-foreground opacity-90"}`}
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
                initial={{ opacity: 0, x: activeNode.cx >= 250 ? "calc(-100% + 8px)" : "-8px", y: "-50%", scale: 0.9 }}
                animate={{ opacity: 1, x: activeNode.cx >= 250 ? "calc(-100% + 8px)" : "-8px", y: "-50%", scale: 1 }}
                exit={{ opacity: 0, x: activeNode.cx >= 250 ? "calc(-100% + 8px)" : "-8px", y: "-50%", scale: 0.9 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className={`absolute z-20 flex items-center ${activeNode.cx >= 250 ? 'flex-row' : 'flex-row-reverse'}`}
                style={{
                  left: `${(activeNode.cx / 500) * 100}%`,
                  top: `${(activeNode.cy / 600) * 100}%`,
                  transformOrigin: activeNode.cx >= 250 ? "right center" : "left center"
                }}
              >
                {/* The Card */}
                <div className="bg-primary text-primary-foreground backdrop-blur-xl border-2 border-primary-foreground/40 rounded-lg p-3 w-36 sm:w-44 pointer-events-auto shrink-0 relative"
                     style={{
                       boxShadow: '0 0 20px hsl(var(--primary)), inset 0 0 10px hsl(var(--primary) / 0.5)'
                     }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-xs sm:text-sm">{activeNode.name}</h3>
                      <p className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-wider">{activeNode.nameEn} Division</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="text-white/80">তালিকাভুক্ত মাদ্রাসা:</span>
                      <span className="font-bold text-white tabular-nums">{activeNode.stats.madrasas}টি</span>
                    </div>
                  </div>
                </div>

                {/* The Dotted Line */}
                <div className="w-[30px] sm:w-[60px] lg:w-[100px] h-[2px] opacity-70 shrink-0" 
                     style={{ backgroundImage: 'linear-gradient(to right, hsl(var(--destructive)) 50%, transparent 50%)', backgroundSize: '8px 2px' }} />
                
                {/* The Dot */}
                <div className="w-4 h-4 shrink-0 rounded-full bg-destructive border-[3.5px] border-background z-10 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
              </motion.div>
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
