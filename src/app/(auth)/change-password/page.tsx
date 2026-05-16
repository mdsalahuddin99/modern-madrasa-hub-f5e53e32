// ===================================================
// Change Password Page — লগইন অবস্থায় পাসওয়ার্ড পরিবর্তন
// ===================================================

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("নতুন পাসওয়ার্ড মিলছে না");
      return;
    }

    if (currentPassword === newPassword) {
      setError("নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ডের মত হতে পারবে না");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "কিছু ভুল হয়েছে");
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back link */}
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ড্যাশবোর্ডে ফিরুন
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">পাসওয়ার্ড পরিবর্তন</h1>
            <p className="text-gray-500 mt-1 text-sm">{session?.user?.email}</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
              ✅ পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড দিন"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার নতুন পাসওয়ার্ড দিন"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
