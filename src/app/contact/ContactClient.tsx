// ===================================================
// Contact Client Component — যোগাযোগ ফর্ম
// ===================================================

"use client";

import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { motion } from "framer-motion";

export default function ContactClient() {
  const { content } = useSiteContent();
  const { contact } = content.pages;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: /api/contact POST কল করুন
    await new Promise((r) => setTimeout(r, 800));

    toast.success("মেসেজ পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করবো।");
    setForm({ name: "", email: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-10 md:pt-28 md:pb-16 bg-gradient-to-b from-emerald-700 to-emerald-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-extrabold text-white mb-3"
          >
            {contact.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm md:text-lg max-w-xl mx-auto"
          >
            {contact.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="py-8 md:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl border p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-xl font-bold text-foreground mb-6">{contact.formTitle}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {contact.nameLabel}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="আপনার নাম লিখুন"
                    className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {contact.messageLabel}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="আপনার মেসেজটি এখানে লিখুন..."
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                  {loading ? "পাঠানো হচ্ছে..." : contact.buttonText}
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">{contact.infoTitle}</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      📞
                    </div>
                    <div>
                      <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">ফোন</div>
                      <div className="font-semibold text-emerald-900">{contact.phone}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      📧
                    </div>
                    <div>
                      <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">ইমেইল</div>
                      <div className="font-semibold text-emerald-900">{contact.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      📍
                    </div>
                    <div>
                      <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">ঠিকানা</div>
                      <div className="font-semibold text-emerald-900">{contact.address}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      🕐
                    </div>
                    <div>
                      <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">অফিস সময়</div>
                      <div className="font-semibold text-emerald-900">{contact.officeHours}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h3 className="font-bold text-foreground mb-2">সাহায্য প্রয়োজন?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  আমাদের সাপোর্ট টিম আপনাকে সাহায্য করার জন্য প্রস্তুত। যেকোনো জিজ্ঞাসায় আমাদের ইমেইল করতে পারেন অথবা সরাসরি ফোন করতে পারেন।
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
