import Link from "next/link";

// Shared utility-bar icon button used by PortalShell + ResidentShell.
// Hidden on mobile (those shells surface the same actions via the
// MobileMenu drawer / MobileTabBar). Optional amber "soon" / "new"
// pill badge in the top-right corner.

export function HeaderIcon({
  href,
  label,
  children,
  badge,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative w-9 h-9 hidden md:inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
    >
      {children}
      {badge && (
        <span className="absolute -top-1 -right-1 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500 text-amber-950">
          {badge}
        </span>
      )}
    </Link>
  );
}
