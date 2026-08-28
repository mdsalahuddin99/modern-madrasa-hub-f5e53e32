import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Admin layout is now handled by src/app/dashboard/admin/layout.tsx

  // Director and other users use a layout with a standard Navbar
  return (
    <div className="min-h-screen bg-background font-bengali">
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  );
}
