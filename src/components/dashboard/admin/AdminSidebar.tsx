"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Shield, TrendingUp, ClipboardCheck, CreditCard, Building2,
  Users, Home, LogOut, LayoutDashboard, Navigation,
  ListOrdered, UserCircle, LogIn, UserPlus, Download, Wallet
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Separator } from "@/components/ui/separator";

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { summary } = useAdmin();

  const isActive = (path: string) => pathname === path;

  const managementItems = [
    { title: "সারসংক্ষেপ", url: "/dashboard/admin", icon: TrendingUp },
    { title: "অনুমোদন", url: "/dashboard/admin/approval", icon: ClipboardCheck, badge: summary.pendingApprovals },
    { title: "সাবস্ক্রিপশন", url: "/dashboard/admin/subscription", icon: CreditCard, badge: summary.pendingSubscriptions },
    { title: "প্ল্যান ম্যানেজমেন্ট", url: "/dashboard/admin/plans", icon: LayoutDashboard },
    { title: "মাদ্রাসা", url: "/dashboard/admin/madrasas", icon: Building2 },
    { title: "ইউজার", url: "/dashboard/admin/users", icon: Users },
    { title: "শিক্ষা বোর্ড", url: "/dashboard/admin/boards", icon: Shield },
  ];

  const pageItems = [
    { title: "নেভবার ও ফুটার", url: "/dashboard/admin/pages/navbar-footer", icon: Navigation },
    { title: "হোমপেজ", url: "/dashboard/admin/pages/homepage", icon: LayoutDashboard },
    { title: "মাদ্রাসা তালিকা", url: "/dashboard/admin/pages/madrasa-list", icon: ListOrdered },
    { title: "মাদ্রাসা প্রোফাইল", url: "/dashboard/admin/pages/madrasa-profile", icon: UserCircle },
    { title: "সম্পর্কে পেজ", url: "/dashboard/admin/pages/about", icon: Building2 },
    { title: "যোগাযোগ পেজ", url: "/dashboard/admin/pages/contact", icon: Users },
    { title: "নিবন্ধন পেজ", url: "/dashboard/admin/pages/register", icon: Building2 },
    { title: "সাবস্ক্রিপশন পেজ", url: "/dashboard/admin/pages/subscription", icon: Wallet },
    { title: "লগইন পেজ", url: "/dashboard/admin/pages/login", icon: LogIn },
    { title: "সাইন আপ পেজ", url: "/dashboard/admin/pages/signup", icon: UserPlus },
    { title: "ইনস্টল পেজ", url: "/dashboard/admin/pages/install", icon: Download },
  ];

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4.5 h-4.5 text-destructive" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-foreground truncate">এডমিন প্যানেল</h2>
              <p className="text-[10px] text-muted-foreground">সম্পূর্ণ ম্যানেজমেন্ট</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="bg-border/40" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3">
            {!collapsed && "ম্যানেজমেন্ট"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="rounded-lg h-9 text-xs font-medium"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                    {!collapsed && item.badge && item.badge > 0 ? (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3">
            {!collapsed && "পাবলিক পেজ"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pageItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="rounded-lg h-9 text-xs font-medium"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Separator className="bg-border/40 mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/")} tooltip="হোম পেজ" className="rounded-lg h-9 text-xs font-medium">
              <Home className="w-4 h-4" />
              {!collapsed && <span>সাইটে যান</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="লগআউট" className="rounded-lg h-9 text-xs font-medium text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>লগআউট</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
