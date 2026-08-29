"use client";

import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Headphones
} from "lucide-react";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ContactClient() {
  const { content } = useSiteContent();
  const { contact } = content.pages;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API Call
    await new Promise((r) => setTimeout(r, 1200));

    toast.success("মেসেজ পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করবো।");
    setForm({ name: "", email: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    { icon: PhoneCall, label: "ফোন নম্বর", value: contact.phone, color: "text-primary", bg: "bg-primary/5" },
    { icon: Mail, label: "ইমেইল ঠিকানা", value: contact.email, color: "text-accent", bg: "bg-accent/5" },
    { icon: MapPin, label: "অফিস ঠিকানা", value: contact.address, color: "text-primary", bg: "bg-primary/5" },
    { icon: Clock, label: "অফিস সময়", value: contact.officeHours, color: "text-accent", bg: "bg-accent/5" },
  ];

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col selection:bg-primary/10">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* App-Style Immersive Hero */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-primary text-white">
          <div className="absolute inset-0 islamic-pattern opacity-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-5 sm:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 active-scale"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-[11px] font-black uppercase tracking-widest">সাহায্য কেন্দ্র</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6"
            >
              {contact.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              {contact.subtitle}
            </motion.p>
          </div>
        </section>

        <div className="container mx-auto px-5 sm:px-8 mt-12 lg:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-start">

            {/* Contact Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-[3rem] p-8 sm:p-12 border border-border/40 shadow-soft relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[5rem] group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10">
                <h2 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-accent rounded-full" />
                  {contact.formTitle}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">আপনার নাম</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="নাম লিখুন"
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">ইমেইল ঠিকানা</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="email@example.com"
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">আপনার বার্তা</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        rows={5}
                        placeholder="এখানে বিস্তারিত লিখুন..."
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-secondary/30 border-none font-bold placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 active-scale gap-3 transition-all hover:gap-5"
                  >
                    {loading ? "পাঠানো হচ্ছে..." : contact.buttonText}
                    <Send className={cn("w-5 h-5", loading ? "animate-pulse" : "")} />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info Cards Side */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-accent p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group active-scale"
              >
                <div className="absolute inset-0 islamic-pattern opacity-10" />
                <h2 className="text-2xl font-black mb-8 relative z-10">{contact.infoTitle}</h2>
                <div className="space-y-6 relative z-10">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 group-hover/item:scale-110 transition-transform">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{info.label}</p>
                        <p className="text-sm font-bold">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card p-8 rounded-[2.5rem] border border-border/40 shadow-soft active-scale group"
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                      <Headphones className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-black text-foreground">সরাসরি সহায়তা</h3>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                  আমাদের সাপোর্ট টিম সপ্তাহে ৭ দিন ২৪ ঘণ্টা আপনার যেকোনো সমস্যায় পাশে আছে। আমাদের সাথে যুক্ত হতে কল করুন।
                </p>
                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest cursor-pointer group-hover:gap-3 transition-all">
                   আমাদের সাথে কথা বলুন <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
