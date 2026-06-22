import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/dashboard/AdminLayout";
import Navbar from "@/components/Navbar";

import { getAdminData } from "@/services/admin-data";
import { AdminProvider } from "@/contexts/AdminContext";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Admin users use the AdminLayout (with sidebar)
  if (session.user.role?.toUpperCase() === "ADMIN") {
    const adminData = await getAdminData();
    return (
      <AdminProvider initialData={adminData}>
        <AdminLayout>{children}</AdminLayout>
      </AdminProvider>
    );
  }

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
