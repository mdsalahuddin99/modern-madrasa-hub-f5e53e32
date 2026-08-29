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
import PageHero from "@/components/PageHero";

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

      <PageHero
        title={contact.title}
        subtitle={contact.subtitle}
        breadcrumbs={[
          { label: "হোম", href: "/" },
          { label: "যোগাযোগ" }
        ]}
      />

      <section className="py-8 md:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg border p-6 md:p-8 shadow-sm"
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
                    className="w-full h-12 px-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
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
                    className="w-full h-12 px-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
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
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary disabled:opacity-50 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
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
              <div className="bg-primary/10 rounded-lg p-8 border border-primary/20">
                <h2 className="text-xl font-bold text-primary mb-6">{contact.infoTitle}</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      📞
                    </div>
                    <div>
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">ফোন</div>
                      <div className="font-semibold text-primary">{contact.phone}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      📧
                    </div>
                    <div>
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">ইমেইল</div>
                      <div className="font-semibold text-primary">{contact.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      📍
                    </div>
                    <div>
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">ঠিকানা</div>
                      <div className="font-semibold text-primary">{contact.address}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      🕐
                    </div>
                    <div>
                      <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">অফিস সময়</div>
                      <div className="font-semibold text-primary">{contact.officeHours}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-8 shadow-sm">
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
