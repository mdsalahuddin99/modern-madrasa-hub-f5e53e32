import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

interface NoticeTabProps {
  contents?: any[];
}

const NoticeTab = ({ contents }: NoticeTabProps) => {
  if (!contents || contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-card rounded-lg border border-border/60">
        <BookMarked className="w-10 h-10 mb-3 opacity-20" />
        <p>বর্তমানে কোনো নোটিশ বা সংবাদ নেই।</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contents.map((item: any, i: number) => (
        <motion.div 
          key={item.id} 
          {...fadeUp(i * 0.05)}
          className="float-card p-5 rounded-lg border border-border/60 bg-card"
        >
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={item.type === "NOTICE" ? "border-amber-500 text-amber-600 bg-amber-50" : "border-primary text-primary bg-primary/5"}>
              {item.type === "NOTICE" ? "নোটিশ" : item.type === "NEWS" ? "খবর" : "ইভেন্ট"}
            </Badge>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {new Date(item.createdAt).toLocaleDateString("bn-BD")}
            </span>
          </div>
          <h4 className="text-lg font-bold text-foreground mb-2">{item.title}</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{item.content}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default NoticeTab;
