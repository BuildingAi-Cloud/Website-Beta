import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Wordmark } from "@/components/ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu, type MobileNavItem } from "@/components/MobileMenu";

const STAFF_ROLES = ["building_manager", "facility_manager", "concierge"] as const;

export default async function DashboardPage() {
  const { authUser, appUser } = await requireUser();

  // Resident dashboard is for residents/tenants only. Staff land on /team.
  if ((STAFF_ROLES as readonly string[]).includes(appUser.role)) redirect("/team");

  const building = appUser.buildingId
    ? await prisma.building.findUnique({ where: { id: appUser.buildingId } })
    : null;
  const unit = appUser.unitId
    ? await prisma.unit.findUnique({ where: { id: appUser.unitId } })
    : null;

  const navItems: MobileNavItem[] = [
    { href: "/dashboard/maintenance", label: "Maintenance" },
    { href: "/dashboard/announcements", label: "Announcements" },
    { href: "/dashboard/account", label: "Account" },
  ];
  const mobileFooter = (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground">
        <div className="font-medium text-foreground truncate">{authUser.email}</div>
        <div className="mt-0.5 capitalize">{appUser.role.replace("_", " ")}</div>
      </div>
      <form action="/auth/signout" method="post">
        <button className="w-full px-3 py-2 rounded-md border border-border hover:bg-muted text-sm transition-colors">
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-40">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <Link href="/dashboard" className="flex items-baseline gap-2 shrink-0">
              <Wordmark className="text-base" />
              <span className="hidden sm:inline text-xs text-muted-foreground uppercase tracking-wider">{appUser.role}</span>
            </Link>
            <nav className="hidden md:flex gap-5 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden lg:inline text-sm text-muted-foreground">{authUser.email}</span>
            <form action="/auth/signout" method="post" className="hidden md:block">
              <button className="px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-sm">
                Sign out
              </button>
            </form>
            <MobileMenu items={navItems} rightSlot={mobileFooter} />
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
        <div className="space-y-1">
          {building ? (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Your building</p>
              <h1 className="text-4xl font-semibold tracking-tight">{building.name}</h1>
              <p className="text-sm text-muted-foreground">
                {unit ? `Unit ${unit.unitNumber} · ` : ""}{building.address}, {building.city}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold tracking-tight">Welcome</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Your account is not yet linked to a building. Ask your Building Manager to assign you.
              </p>
            </>
          )}
        </div>

        <nav className="mt-10 grid sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/maintenance"
            className="block bg-card border border-border rounded-md p-5 hover:border-accent transition-colors"
          >
            <div className="font-semibold">Maintenance</div>
            <div className="text-sm text-muted-foreground mt-1">Request a repair, see open tickets</div>
          </Link>
          <Link
            href="/dashboard/announcements"
            className="block bg-card border border-border rounded-md p-5 hover:border-accent transition-colors"
          >
            <div className="font-semibold">Announcements</div>
            <div className="text-sm text-muted-foreground mt-1">Notices from your building team</div>
          </Link>
        </nav>
      </main>
    </div>
  );
}
