import { Building2, Users, UserCog, ClipboardCheck, CreditCard, TrendingUp } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const AdminStats = ({ summary: propSummary }: { summary?: any }) => {
  const { summary: ctxSummary } = useAdmin();
  const summary = propSummary || ctxSummary;

  const stats = [
    { label: "মোট মাদ্রাসা", value: summary?.totalMadrasas || 0, icon: Building2, color: "bg-primary/10 text-primary" },
    { label: "মোট ব্যবহারকারী", value: summary?.totalUsers || 0, icon: Users, color: "bg-accent/15 text-accent" },
    { label: "পরিচালক", value: summary?.totalDirectors || 0, icon: UserCog, color: "bg-primary/10 text-primary" },
    { label: "অপেক্ষমাণ অনুমোদন", value: summary?.pendingApprovals || 0, icon: ClipboardCheck, color: "bg-amber-500/10 text-amber-600" },
    { label: "সক্রিয় সাবস্ক্রিপশন", value: summary?.activeSubscriptions || 0, icon: CreditCard, color: "bg-blue-500/10 text-blue-600" },
    { label: "অপেক্ষমাণ পেমেন্ট", value: summary?.pendingSubscriptions || 0, icon: TrendingUp, color: "bg-rose-500/10 text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="float-card bg-card rounded-2xl border border-border/60 p-4">
          <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2.5`}>
            <s.icon className="w-4.5 h-4.5" />
          </div>
          <div className="text-lg font-extrabold text-foreground">{s.value}</div>
          <div className="text-[10px] md:text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
