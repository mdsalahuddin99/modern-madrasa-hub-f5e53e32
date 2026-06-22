import { auth } from "@/lib/auth";
import { AdminOverview } from "@/components/dashboard/AdminPages";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";
import VisitorDashboard from "@/components/dashboard/VisitorDashboard";
import { getAdminData } from "@/services/admin-data";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user?.role?.toUpperCase() === "ADMIN") {
    const adminData = await getAdminData();
    return <AdminOverview initialData={adminData} />;
  }

  if (session?.user?.role?.toUpperCase() === "DIRECTOR") {
    return <DirectorDashboard />;
  }

  return <VisitorDashboard />;
}
