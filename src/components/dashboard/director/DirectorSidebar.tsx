"use client";

import { useRouter } from "next/navigation";
import {
  Building2, Users, BookOpen, Upload, MessageCircle,
  Eye, Lock, LogOut, Home
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DirectorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLocked: boolean;
  onLockedAction: () => void;
}

const DirectorSidebar = ({ activeTab, setActiveTab, isLocked, onLockedAction }: DirectorSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "about", label: "পরিচিতি", icon: Building2, premium: false },
    { id: "academic", label: "একাডেমিক", icon: BookOpen, premium: true },
    { id: "staff", label: "শিক্ষার্থী ও শিক্ষক", icon: Users, premium: true },
    { id: "admission", label: "ভর্তি তথ্য", icon: Upload, premium: true },
    { id: "gallery", label: "গ্যালারি", icon: Upload, premium: true },
    { id: "contact", label: "যোগাযোগ", icon: MessageCircle, premium: true },
    { id: "seo", label: "এসইও", icon: Eye, premium: true },
  ];

  const handleTabClick = (id: string, premium: boolean) => {
    if (premium && isLocked) {
      onLockedAction();
      return;
    }
    setActiveTab(id);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 hidden md:flex">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4.5 h-4.5 text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-foreground truncate">মাদ্রাসা হাব</h2>
              <p className="text-[10px] text-muted-foreground">পরিচালক প্যানেল</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="bg-border/40" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3">
            {!collapsed && "মডিউল সমূহ"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleTabClick(item.id, item.premium)}
                    isActive={activeTab === item.id}
                    tooltip={item.label}
                    className="rounded-xl h-10 text-xs font-medium"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.premium && isLocked && (
                      <Lock className="w-3 h-3 ml-auto text-muted-foreground" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="space-y-4">
          <Separator className="bg-border/40" />
          
          {!collapsed && user && (
            <div className="px-2 py-2 flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-lg border border-border/40">
                <AvatarImage src={user.email} />
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user.name || "ইউজার"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push("/")} tooltip="হোম পেজ" className="rounded-xl h-9 text-xs font-medium">
                <Home className="w-4 h-4" />
                {!collapsed && <span>সাইটে যান</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="লগআউট" className="rounded-xl h-9 text-xs font-medium text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>লগআউট</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DirectorSidebar;
