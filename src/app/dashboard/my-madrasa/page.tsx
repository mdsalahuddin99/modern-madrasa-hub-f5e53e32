// ===================================================
// Madrasa Admin Dashboard Page
// ===================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";

export const metadata: Metadata = {
  title: "আমার মাদ্রাসা — কওমি মাদ্রাসা ডিরেক্টরি",
  description: "আপনার মাদ্রাসার প্রোফাইল ও সাবস্ক্রিপশন ম্যানেজমেন্ট প্যানেল",
};

export default async function MyMadrasaPage() {
  const session = await auth();
  
  // Only allow INSTITUTION_ADMIN to access this page
  if (!session?.user || session.user.role !== "INSTITUTION_ADMIN") {
    redirect("/dashboard");
  }

  return <DirectorDashboard />;
}
