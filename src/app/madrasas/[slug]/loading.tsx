import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      {/* Header Skeleton */}
      <div className="h-16 w-full bg-white dark:bg-card border-b border-border/40" />

      {/* Hero Skeleton */}
      <div className="h-[40vh] md:h-[50vh] w-full bg-muted animate-pulse" />

      {/* Profile Info Container */}
      <div className="container mx-auto px-5 max-w-7xl -mt-16 md:-mt-20 relative z-20">
        <div className="bg-card rounded-[2.5rem] p-6 lg:p-10 shadow-soft border border-border/40">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
            {/* Logo Skeleton */}
            <Skeleton className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl" />
            
            <div className="flex-1 space-y-4 pt-2">
              <Skeleton className="h-8 lg:h-12 w-3/4 max-w-[400px]" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 mt-10 lg:mt-16">
          <div className="space-y-8">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
            
            <div className="bg-card rounded-[2rem] p-8 space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
