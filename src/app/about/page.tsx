// ===================================================
// About Page — আমাদের সম্পর্কে
// ===================================================

import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে — কওমি মাদ্রাসা ডিরেক্টরি",
  description: "কওমি মাদ্রাসা ডিরেক্টরির লক্ষ্য, উদ্দেশ্য ও বৈশিষ্ট্য সম্পর্কে জানুন।",
};

export default function AboutPage() {
  return <AboutClient />;
}
