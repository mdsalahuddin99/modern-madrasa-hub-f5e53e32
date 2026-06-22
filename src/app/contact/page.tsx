// ===================================================
// Contact Page — যোগাযোগ
// ===================================================

import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "যোগাযোগ — কওমি মাদ্রাসা ডিরেক্টরি",
  description: "আমাদের সাথে যোগাযোগ করুন। ফোন, ইমেইল বা মেসেজ পাঠান।",
};

export default function ContactPage() {
  return <ContactClient />;
}
