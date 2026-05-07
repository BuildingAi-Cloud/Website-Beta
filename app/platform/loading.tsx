import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function PlatformLoading() {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-6xl mx-auto">
      <Skeleton className="h-9 w-40" />
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
      <div className="mt-10 space-y-2">
        <Skeleton className="h-3 w-32 mb-3" />
        {Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} height="h-12" />)}
      </div>
    </main>
  );
}
