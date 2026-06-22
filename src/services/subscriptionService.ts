// Subscription/payment service — abstracts all subscription operations
// Currently localStorage-based, ready for payment gateway integration

import type { MadrasaSubscription, SubscriptionPlan } from "@/types";

const SUBS_KEY = "qawmi_subscriptions";

export const plans: SubscriptionPlan[] = [
  {
    id: "plan-1y",
    name: "১ বছর",
    duration: 1,
    pricePerYear: 5000,
    totalPrice: 5000,
    features: ["পাবলিক প্রোফাইল", "সার্চ তালিকায় প্রদর্শন", "যোগাযোগ তথ্য প্রকাশ"],
  },
  {
    id: "plan-2y",
    name: "২ বছর",
    duration: 2,
    pricePerYear: 4500,
    totalPrice: 9000,
    features: ["পাবলিক প্রোফাইল", "সার্চ তালিকায় প্রদর্শন", "যোগাযোগ তথ্য প্রকাশ", "ফিচার্ড ব্যাজ"],
  },
  {
    id: "plan-3y",
    name: "৩ বছর",
    duration: 3,
    pricePerYear: 4000,
    totalPrice: 12000,
    features: ["পাবলিক প্রোফাইল", "সার্চ তালিকায় প্রদর্শন", "যোগাযোগ তথ্য প্রকাশ", "ফিচার্ড ব্যাজ", "শীর্ষ অগ্রাধিকার"],
  },
];

export const subscriptionService = {
  async getAll(): Promise<MadrasaSubscription[]> {
    try {
      return JSON.parse(localStorage.getItem(SUBS_KEY) || "[]");
    } catch {
      return [];
    }
  },

  async save(data: MadrasaSubscription[]): Promise<void> {
    localStorage.setItem(SUBS_KEY, JSON.stringify(data));
  },

  async getByMadrasaId(madrasaId: string): Promise<MadrasaSubscription | null> {
    const subs = await this.getAll();
    const active = subs.find((s) => s.madrasaId === madrasaId && s.status === "active");
    if (active) return active;
    const pending = subs.find((s) => s.madrasaId === madrasaId && s.status === "pending");
    return pending || null;
  },

  async isActive(madrasaId: string): Promise<boolean> {
    const sub = await this.getByMadrasaId(madrasaId);
    if (!sub || sub.status !== "active") return false;
    if (sub.endDate && new Date(sub.endDate) < new Date()) return false;
    return true;
  },

  async submit(subscription: MadrasaSubscription): Promise<void> {
    const subs = await this.getAll();
    subs.push(subscription);
    await this.save(subs);
  },

  async approve(id: string, note?: string): Promise<void> {
    const subs = await this.getAll();
    const updated = subs.map((s) =>
      s.id === id
        ? {
            ...s,
            status: "active" as const,
            reviewedAt: new Date().toISOString(),
            reviewNote: note,
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + (plans.find((p) => p.id === s.planId)?.duration || 1) * 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }
        : s
    );
    await this.save(updated);
  },

  async reject(id: string, note?: string): Promise<void> {
    const subs = await this.getAll();
    const updated = subs.map((s) =>
      s.id === id
        ? { ...s, status: "rejected" as const, reviewedAt: new Date().toISOString(), reviewNote: note }
        : s
    );
    await this.save(updated);
  },

  getPlans: () => plans,
};

// Utility helpers
export const toBn = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

export const formatBDT = (amount: number) => `৳${toBn(amount)}`;
