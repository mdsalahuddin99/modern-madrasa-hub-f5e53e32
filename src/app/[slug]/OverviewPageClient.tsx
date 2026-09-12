"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, GraduationCap, Calendar, BookOpen, ChevronRight, Bell, ImageIcon, ArrowRight, CheckCircle2, MessageSquareQuote, Target, ClipboardList, Trophy } from "lucide-react";
import { cn, toBn } from "@/lib/utils";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

export default function OverviewPageClient({ madrasa }: { madrasa: any }) {
  const pathPrefix = `/${madrasa.slug}`;

  // Top 3 Notices
  const recentNotices = madrasa.contents?.filter((c: any) => c.type === 'NOTICE').slice(0, 3) || [];

  // Top 3-4 Gallery Images
  const galleryImages = madrasa.galleryImages?.slice(0, 4) || [];

  const coreFeatures = madrasa.coreFeatures || [];
  const departments = madrasa.departments || [];
  const topTeachers = madrasa.staffList?.filter((s: any) => s.isTeachingStaff).slice(0, 4) || [];
  const recentAchievements = madrasa.achievements?.slice(0, 3) || [];

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: About & Gallery */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Snippet */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
               <BookOpen className="w-40 h-40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              মাদরাসা সম্পর্কে
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed font-medium opacity-90 line-clamp-4 mb-6">
              {madrasa.history || madrasa.description || "এই মাদরাসাটির বিস্তারিত পরিচিতি খুব শীঘ্রই আপডেট করা হবে। মাদরাসাটির লক্ষ্য ও উদ্দেশ্য এবং এর ইতিহাস সম্পর্কে জানতে আমাদের সাথেই থাকুন।"}
            </p>
            <Link 
              href={`${pathPrefix}/about`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <span>বিস্তারিত পড়ুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Principal's Message Snippet */}
          {madrasa.principalMessage && (
            <div className="bg-primary/5 rounded-3xl p-6 md:p-8 border border-primary/10 relative">
              <MessageSquareQuote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex-shrink-0 border-2 border-primary/30 flex items-center justify-center text-primary overflow-hidden">
                   {madrasa.principalName ? <span className="font-bold text-xl">{madrasa.principalName.charAt(0)}</span> : <Users className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{madrasa.principalName || "অধ্যক্ষ / মুহতামিম"}</h3>
                  <p className="text-sm font-semibold text-primary mb-3">{madrasa.principalRole || "পরিচালক"}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 italic mb-4">
                    "{madrasa.principalMessage}"
                  </p>
                  <Link href={`${pathPrefix}/about#director`} className="text-sm font-bold text-primary hover:underline">
                    সম্পূর্ণ বাণী পড়ুন →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Core Features */}
          {coreFeatures.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                কেন আমাদের জামিয়া?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreFeatures.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admission Snippet */}
          {madrasa.admissionRules && madrasa.admissionRules.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  ভর্তির তথ্য
                </h2>
              </div>
              <div className="bg-white dark:bg-card p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden mb-5">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                   <ClipboardList className="w-40 h-40" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-4">ভর্তির সাধারণ নিয়মাবলী</h3>
                <div className="space-y-3 relative z-10">
                  {madrasa.admissionRules.slice(0, 3).map((rule: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 text-xs font-bold mt-0.5">
                        {toBn(idx + 1)}
                      </div>
                      <p className="text-sm text-foreground/80 font-medium leading-relaxed line-clamp-2">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link 
                href={`${pathPrefix}/admission`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <span>বিস্তারিত ভর্তি তথ্য</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Achievements Snippet */}
          {recentAchievements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
                  সাফল্য ও অর্জন
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {recentAchievements.map((achievement: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-card p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm h-full flex flex-col group hover:border-yellow-500/30 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-500 shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">{achievement.title}</h3>
                        {achievement.date && (
                          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">{toBn(new Date(achievement.date).getFullYear())}</div>
                        )}
                      </div>
                    </div>
                    {achievement.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <Link 
                href={`${pathPrefix}/achievements`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 font-semibold hover:bg-yellow-500 hover:text-white transition-all duration-300"
              >
                <span>সকল সাফল্য দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Gallery Snippet */}
          {galleryImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-accent rounded-full" />
                  ফটো গ্যালারি
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-5">
                {galleryImages.slice(0, 2).map((img: any, idx: number) => (
                  <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group">
                    <Image
                      src={optimizeCloudinaryUrl(img.url)}
                      alt={img.caption || madrasa.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>
                ))}
              </div>
              <Link 
                href={`${pathPrefix}/gallery`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent hover:text-white transition-all duration-300"
              >
                <span>সম্পূর্ণ গ্যালারি দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Academic Departments Snippet */}
          {departments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  বিভাগসমূহ
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {departments.slice(0, 4).map((dept: any, idx: number) => (
                  <Link href={`${pathPrefix}/academic/${dept.type.toLowerCase()}`} key={idx} className="block group">
                    <div className="bg-white dark:bg-card p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all group-hover:border-primary/30 h-full">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{dept.description || "এই বিভাগের বিস্তারিত খুব শীঘ্রই যুক্ত করা হবে।"}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href={`${pathPrefix}/academic`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <span>সকল বিভাগ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Teachers Snippet */}
          {topTeachers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  সম্মানিত ওস্তাদমণ্ডলী
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {topTeachers.map((teacher: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-white dark:bg-card p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm h-full">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                      {teacher.image ? (
                        <Image src={optimizeCloudinaryUrl(teacher.image)} alt={teacher.name} width={48} height={48} className="rounded-full object-cover w-full h-full" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-1">{teacher.name}</h3>
                      <p className="text-xs font-semibold text-primary line-clamp-1">{teacher.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href={`${pathPrefix}/about#teachers`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 text-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <span>সকল শিক্ষকের তালিকা</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Notices & CTAs */}
        <div className="space-y-6">
          {/* Action Cards */}
          <Link href={`${pathPrefix}/admission`} className="block group">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-3xl text-primary-foreground relative overflow-hidden shadow-lg shadow-primary/25 transition-transform group-hover:-translate-y-1">
              <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-125 transition-transform duration-500">
                <GraduationCap className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-2">ভর্তির তথ্য</h3>
              <p className="text-primary-foreground/80 text-sm font-medium mb-4">ভর্তি প্রক্রিয়া ও ফি সম্পর্কে বিস্তারিত জানুন</p>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Notice Board */}
          <div className="bg-white dark:bg-card rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10 bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                সাম্প্রতিক নোটিশ
              </h3>
              <Link href={`${pathPrefix}/notices`} className="text-xs font-semibold text-primary hover:underline">
                সব দেখুন
              </Link>
            </div>
            <div className="p-2">
              {recentNotices.length > 0 ? (
                recentNotices.map((notice: any) => (
                  <Link 
                    key={notice.id} 
                    href={`${pathPrefix}/notices/${notice.slug}`}
                    className="block p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                  >
                    <div className="text-xs font-semibold text-muted-foreground mb-1">{new Date(notice.createdAt).toLocaleDateString('bn-BD')}</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {notice.title}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-sm font-medium text-muted-foreground">
                  কোনো নোটিশ নেই
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
