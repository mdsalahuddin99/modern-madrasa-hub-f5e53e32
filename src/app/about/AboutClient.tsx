// ===================================================
// About Client Component — Clean & Professional
// ===================================================

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { 
  Target, Eye, ShieldCheck, Search, PhoneCall, 
  MapPin, BookOpen, HeartHandshake, ChevronRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function AboutClient() {
  const { content } = useSiteContent();
  const { about } = content.pages;
  const { stats, cta } = content;

  // Icon mapping for features based on index
  const getFeatureIcon = (index: number) => {
    switch (index) {
      case 0: return <ShieldCheck className="w-8 h-8 text-primary" />;
      case 1: return <Search className="w-8 h-8 text-primary" />;
      case 2: return <HeartHandshake className="w-8 h-8 text-primary" />;
      case 3: return <PhoneCall className="w-8 h-8 text-primary" />;
      default: return <CheckCircle2 className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <PageHero
        title={about.title}
        subtitle={about.subtitle}
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "আমাদের সম্পর্কে" }
        ]}
      >
        <Link 
          href="/madrasas" 
          className="px-6 py-3 bg-white text-primary rounded-md font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          মাদ্রাসা খুঁজুন
        </Link>
        <Link 
          href="/contact" 
          className="px-6 py-3 bg-transparent text-white border border-white/30 rounded-md font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <PhoneCall className="w-5 h-5" />
          যোগাযোগ করুন
        </Link>
      </PageHero>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}{stat.suffix}
                </h3>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div className="bg-white rounded-xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{about.mission.title}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {about.mission.description}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{about.vision.title}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {about.vision.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              {about.features.title}
            </h2>
            <p className="text-slate-600 text-lg">
              আমরা কীভাবে আপনাদের সেবা প্রদান করছি তার এক ঝলক
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {about.features.items.map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:border-primary/30 transition-colors">
                <div className="mb-6">
                  {getFeatureIcon(i)}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <BookOpen className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {cta.title} {cta.titleLine2}
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-10 leading-relaxed">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-3.5 bg-white text-primary rounded-md font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {cta.buttonText}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/madrasas" 
              className="px-8 py-3.5 bg-transparent border border-white/40 text-white rounded-md font-bold hover:bg-white/10 transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              মাদ্রাসা খুঁজুন
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

