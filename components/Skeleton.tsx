// Tiny skeleton primitives. Pulse animation matches Tailwind's default.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/60 rounded ${className}`} />;
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonRow({ height = "h-16" }: { height?: string }) {
  return <Skeleton className={`${height} w-full rounded-md`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-md p-5 space-y-3 ${className}`}>
      <Skeleton className="h-5 w-2/3" />
      <SkeletonText lines={2} />
    </div>
  );
}
