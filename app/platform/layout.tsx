import { requirePlatformAdmin } from "@/lib/platform";
import { PortalShell } from "@/components/PortalShell";
import type { NavSection } from "@/components/MobileMenu";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { authUser, appUser } = await requirePlatformAdmin();

  // Platform admin IA. Overview is standalone (no L2 row). Customers
  // groups the tenant-side surfaces the admin manages day-to-day;
  // Compliance + Growth keep the more occasional admin tools out of
  // the L1 row by default.
  const sections: NavSection[] = [
    {
      label: "Overview",
      items: [{ href: "/platform", label: "Overview" }],
    },
    {
      label: "Customers",
      items: [
        { href: "/platform/users", label: "Users" },
        { href: "/platform/buildings", label: "Buildings" },
        { href: "/platform/pilot-onboarding", label: "Pilot script" },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/platform/audit-log", label: "Audit log" }],
    },
    {
      label: "Growth",
      items: [{ href: "/platform/outreach", label: "Outreach" }],
    },
  ];

  return (
    <PortalShell
      portalLabel="Platform"
      portalHome="/platform"
      navSections={sections}
      userName={appUser.name}
      userEmail={authUser.email!}
      userRole={appUser.role}
    >
      {children}
    </PortalShell>
  );
}
