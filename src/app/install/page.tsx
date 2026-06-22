// ===================================================
// Install Page — PWA ইনস্টল পেজ
// ===================================================

import type { Metadata } from "next";
import InstallClient from "./InstallClient";

export const metadata: Metadata = {
  title: "অ্যাপ ইনস্টল করুন — কওমি মাদ্রাসা ডিরেক্টরি",
  description: "মাদ্রাসা ডিরেক্টরি অ্যাপ আপনার ফোনে ইনস্টল করুন।",
};

export default function InstallPage() {
  return <InstallClient />;
}
