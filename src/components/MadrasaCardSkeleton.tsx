import { Skeleton } from "@/components/ui/skeleton";

const MadrasaCardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border/40 shadow-soft overflow-hidden">
    {/* Image Skeleton */}
    <div className="relative aspect-[16/10] bg-secondary/20 overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>

    {/* Content Skeleton */}
    <div className="p-4 sm:p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-6 w-3/4 rounded-md" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2 w-10 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default MadrasaCardSkeleton;
