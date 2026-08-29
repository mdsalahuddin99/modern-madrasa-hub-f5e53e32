"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Shield, TrendingUp, ClipboardCheck, CreditCard, Building2,
  Users, Home, LogOut, LayoutDashboard, Navigation,
  ListOrdered, UserCircle, LogIn, UserPlus, Download, Wallet, Sparkles, ChevronRight
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Separator } from "@/components/ui/separator";
import { cn, toBn } from "@/lib/utils";

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { summary } = useAdmin();

  const isActive = (path: string) => pathname === path;

  const managementItems = [
    { title: "ওভারভিউ", url: "/dashboard/admin", icon: TrendingUp },
    { title: "অনুমোদন", url: "/dashboard/admin/approval", icon: ClipboardCheck, badge: summary.pendingApprovals },
    { title: "সাবস্ক্রিপশন", url: "/dashboard/admin/subscription", icon: CreditCard, badge: summary.pendingSubscriptions },
    { title: "প্ল্যান সেটআপ", url: "/dashboard/admin/plans", icon: LayoutDashboard },
    { title: "মাদ্রাসা সমূহ", url: "/dashboard/admin/madrasas", icon: Building2 },
    { title: "ইউজার লিস্ট", url: "/dashboard/admin/users", icon: Users },
    { title: "শিক্ষা বোর্ড", url: "/dashboard/admin/boards", icon: Shield },
  ];

  const pageItems = [
    { title: "নেভবার ও ফুটার", url: "/dashboard/admin/pages/navbar-footer", icon: Navigation },
    { title: "হোমপেজ", url: "/dashboard/admin/pages/homepage", icon: LayoutDashboard },
    { title: "মাদ্রাসা তালিকা", url: "/dashboard/admin/pages/madrasa-list", icon: ListOrdered },
    { title: "প্রোফাইল পেজ", url: "/dashboard/admin/pages/madrasa-profile", icon: UserCircle },
    { title: "সম্পর্কে", url: "/dashboard/admin/pages/about", icon: InfoIcon },
    { title: "যোগাযোগ", url: "/dashboard/admin/pages/contact", icon: ContactIcon },
    { title: "রেজিস্ট্রেশন", url: "/dashboard/admin/pages/register", icon: UserPlus },
    { title: "সাবস্ক্রিপশন", url: "/dashboard/admin/pages/subscription", icon: Wallet },
  ];

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-slate-950 text-slate-300">
      {/* Premium Header */}
      <SidebarHeader className="p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 border border-white/10 active-scale">
            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-black text-white tracking-tighter truncate">সুপার এডমিন</h2>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">ম্যানেজমেন্ট</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-2">
            {!collapsed && "সিস্টেম ম্যানেজমেন্ট"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {managementItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.url)}
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl h-11 transition-all active-scale px-4",
                        active
                          ? "bg-primary text-white shadow-lg shadow-primary/10 font-bold"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-accent" : "")} />
                      {!collapsed && <span className="ml-2 truncate">{item.title}</span>}
                      {!collapsed && item.badge && item.badge > 0 ? (
                        <span className="ml-auto bg-accent text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm">
                          {toBn(item.badge)}
                        </span>
                      ) : (
                        !collapsed && active && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4 my-4 bg-border/40" />

        {/* Content Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-2">
            {!collapsed && "পেজ কন্টেন্ট"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {pageItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => router.push(item.url)}
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl h-11 transition-all active-scale px-4",
                        active
                          ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-2 truncate">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-slate-950 border-t border-slate-800">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/")}
              tooltip="হোম পেজ"
              className="rounded-xl h-11 font-black text-xs uppercase tracking-widest active-scale bg-slate-900 text-white shadow-sm border border-slate-800 hover:bg-slate-800"
            >
              <Home className="w-4.5 h-4.5 text-accent" />
              {!collapsed && <span className="ml-2">সাইটে ফিরে যান</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="লগআউট"
              className="rounded-xl h-11 font-black text-xs uppercase tracking-widest active-scale text-red-400 hover:bg-red-950/30 hover:text-red-300"
            >
              <LogOut className="w-4.5 h-4.5" />
              {!collapsed && <span className="ml-2">লগআউট করুন</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="mt-4 flex flex-col items-center opacity-40">
             <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Madrasah Portal Pro</span>
             </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);

const ContactIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default AdminSidebar;
