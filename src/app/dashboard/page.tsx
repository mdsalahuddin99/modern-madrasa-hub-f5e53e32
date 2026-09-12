import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";
import VisitorDashboard from "@/components/dashboard/VisitorDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user?.role?.toUpperCase() === "SUPER_ADMIN") {
    redirect("/dashboard/admin");
  }

  if (session?.user?.role?.toUpperCase() === "INSTITUTION_ADMIN") {
    redirect("/dashboard/my-madrasa");
  }

  return <VisitorDashboard />;
}
