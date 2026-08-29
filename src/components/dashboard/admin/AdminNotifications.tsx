import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCircle2, CreditCard, Building2, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/contexts/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "approval" | "subscription";
  title: string;
  message: string;
  time: string;
  read: boolean;
}



const AdminNotifications = () => {
  const { summary } = useAdmin();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCounts, setLastCounts] = useState<any>({});
  const [open, setOpen] = useState(false);

  // Detect new pending items and generate notifications
  const checkForNew = useCallback(() => {
    const last = lastCounts;
    const newNotifs: Notification[] = [];
    const now = new Date().toISOString();

    if (summary.pendingApprovals > (last.pendingApprovals || 0)) {
      const diff = summary.pendingApprovals - (last.pendingApprovals || 0);
      newNotifs.push({
        id: `approval-${Date.now()}`,
        type: "approval",
        title: "নতুন মাদ্রাসা আবেদন",
        message: `${diff}টি নতুন মাদ্রাসা অনুমোদনের অপেক্ষায় রয়েছে`,
        time: now,
        read: false,
      });
    }

    if (summary.pendingSubscriptions > (last.pendingSubscriptions || 0)) {
      const diff = summary.pendingSubscriptions - (last.pendingSubscriptions || 0);
      newNotifs.push({
        id: `sub-${Date.now()}`,
        type: "subscription",
        title: "নতুন পেমেন্ট আবেদন",
        message: `${diff}টি নতুন সাবস্ক্রিপশন পেমেন্ট যাচাইয়ের অপেক্ষায়`,
        time: now,
        read: false,
      });
    }

    if (newNotifs.length > 0) {
      const updated = [...newNotifs, ...notifications].slice(0, 50);
      setNotifications(updated);
    }

    setLastCounts({
      pendingApprovals: summary.pendingApprovals,
      pendingSubscriptions: summary.pendingSubscriptions,
    });
  }, [summary.pendingApprovals, summary.pendingSubscriptions, notifications, lastCounts]);

  useEffect(() => {
    checkForNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.pendingApprovals, summary.pendingSubscriptions]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
    return `${Math.floor(hrs / 24)} দিন আগে`;
  };

  const iconMap = {
    approval: <Building2 className="w-4 h-4 text-amber-600" />,
    subscription: <CreditCard className="w-4 h-4 text-blue-600" />,
  };

  const bgMap = {
    approval: "bg-amber-500/10",
    subscription: "bg-blue-500/10",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 rounded-lg">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-lg overflow-hidden border-border/50">
        {/* Header */}
        <div className="p-3 border-b border-border/40 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">নোটিফিকেশন</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{unreadCount} নতুন</Badge>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-[10px] px-2 rounded-lg">
                <CheckCircle2 className="w-3 h-3 mr-1" />সব পড়া
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-[10px] px-2 rounded-lg text-destructive hover:text-destructive">
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">কোনো নোটিফিকেশন নেই</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left p-3 hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${bgMap[n.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {iconMap[n.type]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className={`text-xs font-medium truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {n.title}
                        </p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[9px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{timeAgo(n.time)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotifications;
