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
import { roleLabel } from "@/components/RoleBadge";
import type { NotificationItem } from "@/components/NotificationBell";
import { getLocale } from "@/lib/locale-server";

// Unified post-login chrome. Refined toward the v2 R&D header pattern:
// utility bar (wordmark + portal label · search · AI · accessibility ·
// bell · theme · avatar) with a section-bar below holding L1 + L2 pill
// nav and a position breadcrumb. Search and AI route to placeholder
// pages until those features ship.

export async function PortalShell({
  portalLabel,
  portalHome,
  navSections,
  userName,
  userEmail,
  userRole,
  notifications,
  children,
}: {
  portalLabel: string;
  portalHome: string;
  navSections: NavSection[];
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
      {/* Row 1 — utility bar. Brand on the left, utility actions on
          the right. Minimal: no nav here, so the header reads as a
          stable "identity + actions" strip. */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <Link href={portalHome} className="flex items-baseline gap-2 shrink-0">
            <Wordmark className="text-base" />
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {portalLabel}
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
              portalHome={portalHome}
              accountHref={settingsHref}
              locale={locale}
            />
            <MobileMenu sections={navSections} rightSlot={mobileFooter} />
          </div>
        </div>
      </header>

      {/* Section bar — L1 + L2 pill rows always visible plus a
          position breadcrumb. Visible on every viewport: pills
          scroll horizontally on narrow widths so mobile users see
          the full nav structure without opening the drawer. */}
      <div className="border-b border-border/60 bg-background">
        <div className="px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto space-y-2.5 md:space-y-3">
          <PortalNavL1 sections={navSections} />
          <PortalNavL2 sections={navSections} />
        </div>
      </div>

      {children}
    </div>
  );
}
