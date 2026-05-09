import Link from "next/link";
import { Pill } from "@/components/ui";
import { roleLabel } from "@/components/RoleBadge";

// Settings page chrome: Back link, title + role + LICENSE pill, then a
// horizontal tab nav with the active tab highlighted in the accent
// pill style. Tabs are URL-driven via the `tab` search param so each
// tab can do its own server-side data fetch.

export type SettingsTab =
  | "profile"
  | "notifications"
  | "billing"
  | "privacy"
  | "system";

const TAB_ORDER: { key: SettingsTab; label: string }[] = [
  { key: "profile",       label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "billing",       label: "Billing" },
  { key: "privacy",       label: "Privacy & data" },
  { key: "system",        label: "System" },
];

export function parseTab(value: string | string[] | undefined): SettingsTab {
  const v = Array.isArray(value) ? value[0] : value;
  if (v && (TAB_ORDER as { key: string }[]).some((t) => t.key === v)) {
    return v as SettingsTab;
  }
  return "profile";
}

export function SettingsShell({
  basePath,
  backHref,
  backLabel,
  role,
  active,
  licenseHref,
  children,
}: {
  basePath: string; // e.g. "/team/settings", "/dashboard/settings"
  backHref: string;
  backLabel: string;
  role: string;
  active: SettingsTab;
  // Optional — only BM/admin surfaces show a License link.
  licenseHref?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto pb-12">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to {backLabel}
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">{roleLabel(role)}</p>
        <div className="mt-3">
          {licenseHref ? (
            <Link href={licenseHref} aria-label="View license">
              <Pill className="text-accent border-accent/40 bg-accent/10 hover:bg-accent/15 transition-colors cursor-pointer">
                License →
              </Pill>
            </Link>
          ) : (
            <Pill className="text-muted-foreground border-border bg-muted/40">License</Pill>
          )}
        </div>
      </div>

      <div className="mt-6 border-b border-border overflow-x-auto scrollbar-hide -mx-4 md:-mx-0 px-4 md:px-0">
        <nav className="flex gap-1 min-w-max">
          {TAB_ORDER.map((t) => {
            const isActive = t.key === active;
            return (
              <Link
                key={t.key}
                href={`${basePath}?tab=${t.key}`}
                className={`px-3 py-2 text-sm uppercase tracking-wider font-mono transition-colors border-b-2 -mb-px ${
                  isActive
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">{children}</div>
    </main>
  );
}
