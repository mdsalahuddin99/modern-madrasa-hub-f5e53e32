import { auth } from "@/lib/auth";
import { AdminOverview } from "@/components/dashboard/AdminPages";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";
import VisitorDashboard from "@/components/dashboard/VisitorDashboard";
import { getAdminData } from "@/services/admin-data";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user?.role?.toUpperCase() === "SUPER_ADMIN") {
    const adminData = await getAdminData();
    return <AdminOverview initialData={adminData} />;
  }

  if (session?.user?.role?.toUpperCase() === "INSTITUTION_ADMIN") {
    return <DirectorDashboard />;
  }

  return <VisitorDashboard />;
}
