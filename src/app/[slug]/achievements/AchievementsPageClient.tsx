"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Target, Crown } from "lucide-react";
import Image from "next/image";

export default function AchievementsPageClient({ madrasa }: { madrasa: any }) {
  const achievements = madrasa.achievements || [];

  if (achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm min-h-[40vh]">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">সাফল্য ও স্বীকৃতি</h3>
        <p className="text-muted-foreground max-w-md">
          মাদ্রাসার সাফল্য, বোর্ড পরীক্ষার রেজাল্ট এবং পুরস্কারের তথ্য এখনো হালনাগাদ করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-accent rounded-full" />
        <h2 className="text-2xl font-bold text-foreground">সাফল্য ও স্বীকৃতি</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-card/60 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            {achievement.imageUrl ? (
              <div className="w-full h-48 relative bg-muted overflow-hidden">
                <Image
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  {achievement.position || "স্বীকৃতি"}
                </div>
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                <Crown className="w-12 h-12 text-primary/40" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  {achievement.position || "স্বীকৃতি"}
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-semibold">
                  {achievement.category === "BOARD_EXAM" ? "বোর্ড পরীক্ষা" : achievement.category === "COMPETITION" ? "প্রতিযোগিতা" : achievement.category}
                </div>
                {achievement.date && (
                  <div className="text-xs font-medium text-muted-foreground">
                    {achievement.date}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{achievement.title}</h3>
              {achievement.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{achievement.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
