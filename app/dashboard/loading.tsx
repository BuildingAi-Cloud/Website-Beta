import { Skeleton, SkeletonCard, SkeletonRow } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 max-w-3xl mx-auto flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </header>
      <main className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-9 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/2" />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="mt-10 space-y-2">
          <Skeleton className="h-3 w-32 mb-3" />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </main>
    </div>
  );
}
