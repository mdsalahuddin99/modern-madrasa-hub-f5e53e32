"use client";

import AdminPlanTab from "@/components/dashboard/admin/AdminPlanTab";

export default function AdminPlansPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-lg md:text-xl font-extrabold text-foreground mb-4">💎 সাবস্ক্রিপশন প্ল্যান ম্যানেজমেন্ট</h1>
      <AdminPlanTab />
    </div>
  );
}
