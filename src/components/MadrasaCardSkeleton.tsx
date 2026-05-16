import { Skeleton } from "@/components/ui/skeleton";

const MadrasaCardSkeleton = () => (
  <div className="float-card bg-card rounded-2xl border border-border/60 overflow-hidden">
    <div className="h-1 bg-muted" />
    <div className="p-4 md:p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3 rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-lg" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex gap-3">
          <Skeleton className="h-3.5 w-12 rounded" />
          <Skeleton className="h-3.5 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  </div>
);

export default MadrasaCardSkeleton;
