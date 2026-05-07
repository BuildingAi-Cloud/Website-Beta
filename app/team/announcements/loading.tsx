import { Skeleton, SkeletonRow } from "@/components/Skeleton";

export default function TeamAnnouncementsLoading() {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-6 h-48 rounded-md" />
      <div className="mt-10 space-y-2">
        <Skeleton className="h-3 w-32 mb-3" />
        <SkeletonRow height="h-20" />
        <SkeletonRow height="h-20" />
      </div>
    </main>
  );
}
