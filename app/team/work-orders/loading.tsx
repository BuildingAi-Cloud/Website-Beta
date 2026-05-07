import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function WorkOrdersLoading() {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-1 h-3 w-24" />
      <div className="mt-8 space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonRow key={i} height="h-24" />
        ))}
      </div>
    </main>
  );
}
