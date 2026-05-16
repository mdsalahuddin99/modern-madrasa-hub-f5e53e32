"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AdminOverview } from "@/components/dashboard/AdminPages";
import DirectorDashboard from "@/components/dashboard/DirectorDashboard";
import VisitorDashboard from "@/components/dashboard/VisitorDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role?.toUpperCase() === "ADMIN") {
    return <AdminOverview />;
  }

  if (user?.role?.toUpperCase() === "DIRECTOR") {
    return <DirectorDashboard />;
  }

  return <VisitorDashboard />;
}
