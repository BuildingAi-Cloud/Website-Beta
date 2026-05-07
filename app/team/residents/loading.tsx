import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function ResidentsLoading() {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="mt-1 h-3 w-32" />
      <div className="mt-8 grid lg:grid-cols-2 gap-3">
        <Skeleton className="h-48 rounded-md" />
        <Skeleton className="h-48 rounded-md" />
      </div>
      <div className="mt-10 space-y-2">
        <Skeleton className="h-3 w-32 mb-3" />
        {Array.from({ length: 4 }, (_, i) => <SkeletonRow key={i} height="h-14" />)}
      </div>
    </main>
  );
}
