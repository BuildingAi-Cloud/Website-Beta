import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function AnnouncementsLoading() {
  return (
    <main className="min-h-dvh px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
      <Skeleton className="h-9 w-48" />
      <div className="mt-8 space-y-2">
        {Array.from({ length: 4 }, (_, i) => <SkeletonRow key={i} height="h-20" />)}
      </div>
    </main>
  );
}
