// ===================================================
// 404 Not Found Page
// ===================================================

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-extrabold text-foreground mb-4">৪০৪</h1>
        <p className="text-xl text-muted-foreground mb-6">দুঃখিত! পেজটি পাওয়া যায়নি</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
