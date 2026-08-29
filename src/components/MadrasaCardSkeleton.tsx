import { Skeleton } from "@/components/ui/skeleton";

const MadrasaCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-4 md:p-5 shadow-sm border border-black/5 overflow-hidden flex flex-col h-full">
    {/* Image Skeleton */}
    <div className="relative aspect-[16/10] bg-secondary/20 rounded-2xl overflow-hidden mb-5 shrink-0">
      <Skeleton className="h-full w-full" />
    </div>

    {/* Content Skeleton */}
    <div className="px-2 flex flex-col flex-1 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>

      <div className="pt-5 mt-auto border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      </div>
    </div>
  </div>
);

export default MadrasaCardSkeleton;
