// Subscription plans and management (localStorage-based, ready for backend migration)

export type PlanDuration = 1 | 2 | 3; // years

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: PlanDuration;
  pricePerYear: number; // BDT
  totalPrice: number;
  features: string[];
}

export interface MadrasaSubscription {
  id: string;
  madrasaId: string;
  madrasaName: string;
  planId: string;
  status: "pending" | "active" | "expired" | "rejected";
  paymentMethod: "bkash" | "nagad" | "rocket" | "bank";
  transactionId: string;
  payerPhone: string;
  startDate?: string;
  endDate?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

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



export const toBn = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

export const formatBDT = (amount: number) => `৳${toBn(amount)}`;
