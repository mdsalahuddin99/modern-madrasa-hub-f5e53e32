import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { getAdminData } from "@/services/admin-data";
import { AdminProvider } from "@/contexts/AdminContext";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role?.toUpperCase() !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const adminData = await getAdminData();
  
  return (
    <AdminProvider initialData={adminData}>
      <AdminLayout>{children}</AdminLayout>
    </AdminProvider>
  );
}
