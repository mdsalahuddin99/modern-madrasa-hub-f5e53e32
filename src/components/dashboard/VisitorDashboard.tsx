"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Star, LogOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const VisitorDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-[100svh] bg-background font-bengali">
      <Navbar />

      <section className="pt-20 pb-6 md:pt-28 md:pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">ড্যাশবোর্ড</p>
                <h1 className="text-xl md:text-2xl font-extrabold text-foreground">
                  আসসালামু আলাইকুম, {user?.email?.split("@")[0]}
                </h1>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 rounded-lg h-9 text-xs">
                <LogOut className="w-3.5 h-3.5" /> লগআউট
              </Button>
            </div>
          </motion.div>

          {/* Quick search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-lg p-5 mb-6"
          >
            <h2 className="text-base font-bold text-foreground mb-3">কী করতে চান?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "মাদ্রাসা খুঁজুন", icon: Search, path: "/madrasas" },
                { label: "ক্যাটাগরি দেখুন", icon: BookOpen, path: "/#categories" },
                { label: "নিকটবর্তী", icon: MapPin, path: "/madrasas" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-background/60 border border-border/40 hover:border-primary/30 transition-all active:scale-[0.98] text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="float-card bg-card rounded-lg border border-border/60 p-8 text-center"
          >
            <Star className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground mb-1">পছন্দের তালিকা</h3>
            <p className="text-sm text-muted-foreground">ব্যাকএন্ড সংযোগের পর আপনার সংরক্ষিত মাদ্রাসা এখানে দেখাবে</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VisitorDashboard;
