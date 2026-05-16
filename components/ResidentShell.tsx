import Link from "next/link";
import { Wordmark } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu, type NavSection } from "@/components/MobileMenu";
import { SignOutButton } from "@/components/SignOutButton";
import { NotificationBell } from "@/components/NotificationBell";
import { AccountMenu } from "@/components/AccountMenu";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { HeaderIcon } from "@/components/HeaderIcon";
import { PortalNavL1, PortalNavL2 } from "@/components/PortalNav";
import { MobileTabBar } from "@/components/MobileTabBar";
import { roleLabel } from "@/components/RoleBadge";
import type { NotificationItem } from "@/components/NotificationBell";
import { getLocale } from "@/lib/locale-server";

// Resident/tenant variant of PortalShell. Desktop gets the v2 R&D
// header pattern (Wordmark · Search/AI/Accessibility/Bell/Theme/
// Avatar) with the L1/L2 pill nav section bar below. Mobile hides
// the entire desktop chrome — the page renders its own dark hero +
// fixed bottom tab bar with a center FAB.

export async function ResidentShell({
  navSections,
  userName,
  userEmail,
  userRole,
  notifications,
  children,
}: {
  navSections: NavSection[];
  userName?: string | null;
  userEmail: string;
  userRole: string;
  notifications?: NotificationItem[];
  children: React.ReactNode;
}) {
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

  const locale = await getLocale();

  return (
    <div className="min-h-dvh">
      {/* Desktop-only chrome. Mobile hides everything except the bottom
          tab bar; the page's own dark hero handles top-level identity. */}
      <header className="hidden md:block border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <Link href="/dashboard" className="flex items-baseline gap-2 shrink-0">
            <Wordmark className="text-base" />
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Home
            </span>
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            {notifications !== undefined && <NotificationBell items={notifications} />}
            <HeaderIcon href="/search" label="Search">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </HeaderIcon>
            <AccessibilityMenu />
            <HeaderIcon href="/ai-assistant" label="AI assistant" badge="soon">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
                <path d="M19 14l.7 1.7L21.5 16.5l-1.7.7L19 19l-.7-1.7L16.5 16.5l1.7-.7L19 14z" />
              </svg>
            </HeaderIcon>
            <ThemeToggle />
            <AccountMenu
              name={userName}
              email={userEmail}
              role={userRole}
              portalHome="/dashboard"
              accountHref="/dashboard/settings"
              locale={locale}
            />
            <MobileMenu sections={navSections} rightSlot={mobileFooter} />
          </div>
        </div>
      </header>

      {/* Section bar — L1 + L2 pill rows + position breadcrumb. Below
          the header so navigation grouping is its own zone, not part
          of the identity strip. */}
      <div className="hidden md:block border-b border-border/60 bg-background">
        <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto space-y-3">
          <PortalNavL1 sections={navSections} />
          <PortalNavL2 sections={navSections} />
        </div>
      </div>

      {children}
      <MobileTabBar />
    </div>
  );
}
