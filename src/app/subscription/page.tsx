// ===================================================
// Subscription Page — সাবস্ক্রিপশন প্ল্যান
// ===================================================

import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "সাবস্ক্রিপশন — কওমি মাদ্রাসা ডিরেক্টরি",
  description: "আপনার মাদ্রাসার প্রোফাইল আপগ্রেড করুন প্রিমিয়াম সাবস্ক্রিপশন দিয়ে।",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
