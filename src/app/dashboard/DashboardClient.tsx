// ===================================================
// Dashboard Client Component — রোল-ভিত্তিক ড্যাশবোর্ড
// ===================================================

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardClient({ user }: { user: DashboardUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar / Header */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-card border-r min-h-screen flex-col p-4">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground">ড্যাশবোর্ড</h2>
            <p className="text-xs text-muted-foreground mt-1">{user.name || user.email}</p>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full mt-1 inline-block">
              {user.role === "SUPER_ADMIN" ? "অ্যাডমিন" : "ডিরেক্টর"}
            </span>
          </div>

          <nav className="space-y-1 flex-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
              📊 ওভারভিউ
            </Link>
            {user.role === "SUPER_ADMIN" && (
              <>
                <Link href="/dashboard/approval" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  ✅ অনুমোদন
                </Link>
                <Link href="/dashboard/madrasas" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  🏫 মাদ্রাসা
                </Link>
                <Link href="/dashboard/users" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  👥 ইউজার
                </Link>
                <Link href="/dashboard/subscription" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  💳 সাবস্ক্রিপশন
                </Link>
              </>
            )}
            {user.role === "INSTITUTION_ADMIN" && (
              <>
                <Link href="/dashboard/my-madrasa" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  🏫 আমার মাদ্রাসা
                </Link>
                <Link href="/change-password" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition">
                  🔑 পাসওয়ার্ড
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition text-left"
          >
            🚪 লগআউট
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            স্বাগতম, {user.name || "ব্যবহারকারী"}!
          </h1>

          {user.role === "SUPER_ADMIN" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "মোট মাদ্রাসা", value: "—", icon: "🏫" },
                { label: "অনুমোদন বাকি", value: "—", icon: "⏳" },
                { label: "মোট ইউজার", value: "—", icon: "👥" },
                { label: "সক্রিয় সাবস্ক্রিপশন", value: "—", icon: "💳" },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl border p-5">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">ডিরেক্টর ড্যাশবোর্ড</h2>
              <p className="text-sm text-muted-foreground">
                আপনার মাদ্রাসার তথ্য, গ্যালারি ও সেটিংস ম্যানেজ করুন।
              </p>
              <p className="text-xs text-muted-foreground/60 mt-4">
                কম্পোনেন্ট মাইগ্রেশনের পর এখানে DirectorDashboard / DirectorWizard আসবে।
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
