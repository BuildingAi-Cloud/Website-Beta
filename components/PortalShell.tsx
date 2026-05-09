import Link from "next/link";
import { Wordmark } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu, type MobileNavItem } from "@/components/MobileMenu";
import { SignOutButton } from "@/components/SignOutButton";
import { NotificationBell } from "@/components/NotificationBell";
import { AccountMenu } from "@/components/AccountMenu";
import { roleLabel } from "@/components/RoleBadge";
import type { NotificationItem } from "@/components/NotificationBell";
import { getLocale } from "@/lib/locale-server";

// Unified post-login chrome. Refined toward the v2 R&D header pattern:
// cleaner Wordmark + tabs row, plus an icon cluster on the right
// (Search · AI · Accessibility · Bell · Theme · Avatar). Search and
// AI route to placeholder pages until those features ship.

function HeaderIcon({
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

export async function PortalShell({
  portalLabel,
  portalHome,
  navItems,
  userName,
  userEmail,
  userRole,
  notifications,
  children,
}: {
  portalLabel: string;
  portalHome: string;
  navItems: MobileNavItem[];
  userName?: string | null;
  userEmail: string;
  userRole: string;
  // Optional — admin /platform doesn't surface a notification feed today.
  notifications?: NotificationItem[];
  children: React.ReactNode;
}) {
  // Mirror of the AccountMenu surface for the mobile drawer footer.
  const mobileFooter = (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        {userName && (
          <div className="font-semibold text-foreground truncate">{userName}</div>
        )}
        <div className="text-foreground/85 truncate">{userEmail}</div>
        <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-accent">
          {roleLabel(userRole)}
        </div>
      </div>
      <SignOutButton fullWidth />
    </div>
  );

  // Settings replaces the old per-portal Account page. Kept the same
  // path convention so existing /team/account, /platform/account links
  // still resolve (those routes redirect to /…/settings).
  const settingsHref = `${portalHome === "/" ? "/dashboard" : portalHome}/settings`;
  const locale = await getLocale();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-5 md:gap-7 min-w-0 flex-1">
            <Link href={portalHome} className="flex items-baseline gap-2 shrink-0">
              <Wordmark className="text-base" />
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {portalLabel}
              </span>
            </Link>
            <nav className="hidden md:flex gap-1 text-sm min-w-0 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <HeaderIcon href="/search" label="Search">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </HeaderIcon>
            <HeaderIcon href="/ai-assistant" label="AI assistant" badge="soon">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
                <path d="M19 14l.7 1.7L21.5 16.5l-1.7.7L19 19l-.7-1.7L16.5 16.5l1.7-.7L19 14z" />
              </svg>
            </HeaderIcon>
            <HeaderIcon href="/accessibility" label="Accessibility">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="4" r="2" />
                <path d="M19 13l-5-2v-3a2 2 0 0 0-4 0v3l-5 2" />
                <path d="M9 22l3-8 3 8" />
                <path d="M9 14h6" />
              </svg>
            </HeaderIcon>
            {notifications !== undefined && <NotificationBell items={notifications} />}
            <ThemeToggle />
            <AccountMenu
              name={userName}
              email={userEmail}
              role={userRole}
              portalHome={portalHome}
              accountHref={settingsHref}
              locale={locale}
            />
            <MobileMenu items={navItems} rightSlot={mobileFooter} />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
