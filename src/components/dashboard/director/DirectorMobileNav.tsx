"use client";

import { 
  Building2, Users, BookOpen, Upload, MessageCircle, 
  Eye, Lock, Menu, LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface DirectorMobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DirectorMobileNav = ({ activeTab, setActiveTab }: DirectorMobileNavProps) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "about", label: "পরিচিতি", icon: Building2 },
    { id: "academic", label: "একাডেমিক", icon: BookOpen },
    { id: "staff", label: "শিক্ষার্থী ও শিক্ষক", icon: Users },
    { id: "admission", label: "ভর্তি তথ্য", icon: Upload },
    { id: "gallery", label: "গ্যালারি", icon: Upload },
    { id: "contact", label: "যোগাযোগ", icon: MessageCircle },
    { id: "seo", label: "এসইও", icon: Eye },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-b border-border/40 z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-sm">মাদ্রাসা হাব</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border/40 text-left">
            <SheetTitle className="text-sm font-bold">মেনু</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start rounded-xl h-11 gap-3 text-xs font-medium"
                onClick={() => handleTabClick(item.id)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          <SheetFooter className="p-4 border-t border-border/40 mt-auto flex flex-col gap-4">
            {user && (
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-9 w-9 rounded-lg border border-border/40">
                  <AvatarImage src={user.email} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user.name || "ইউজার"}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}
            <Separator className="bg-border/40" />
            <Button 
              variant="ghost" 
              className="w-full justify-start rounded-xl h-10 gap-3 text-xs font-medium text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              লগআউট
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DirectorMobileNav;
