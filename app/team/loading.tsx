import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function TeamLoading() {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-9 w-1/2" />
      <Skeleton className="mt-2 h-3 w-3/4" />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-card border border-border rounded-md p-5 space-y-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-2">
        <Skeleton className="h-3 w-32 mb-3" />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </main>
  );
}
