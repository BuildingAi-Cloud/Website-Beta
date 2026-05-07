import Link from "next/link";
import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";

export default async function TeamHome() {
  const { appUser } = await requireTeam();

  const [building, openCount, residentCount, announcementCount] = appUser.buildingId
    ? await Promise.all([
        prisma.building.findUnique({ where: { id: appUser.buildingId } }),
        prisma.workOrder.count({ where: { buildingId: appUser.buildingId, status: { in: ["open", "assigned", "in_progress"] } } }),
        prisma.user.count({ where: { buildingId: appUser.buildingId, role: { in: ["resident", "tenant"] } } }),
        prisma.announcement.count({ where: { buildingId: appUser.buildingId } }),
      ])
    : [null, 0, 0, 0];

  const isBM = appUser.role === "building_manager";

  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-5xl mx-auto">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{appUser.role.replace("_", " ")}</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{building ? building.name : "Your team"}</h1>
        {building && (
          <p className="text-sm text-muted-foreground">
            {building.address}, {building.city}, {building.state} {building.zipCode}
          </p>
        )}
        {!building && (
          <p className="text-sm text-muted-foreground">
            Your account is not yet linked to a building. Ask your platform admin.
          </p>
        )}
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-3">
        <StatLink href="/team/work-orders" value={openCount} label="Open work orders" />
        <StatLink href="/team/residents" value={residentCount} label="Residents" />
        <StatLink
          href={isBM ? "/team/announcements" : null}
          value={announcementCount}
          label="Announcements"
        />
      </div>
    </main>
  );
}

function StatLink({ href, value, label }: { href: string | null; value: number; label: string }) {
  const inner = (
    <>
      <div className="text-3xl md:text-4xl font-semibold tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </>
  );
  const className = "block p-5 bg-card border border-border rounded-md transition-colors";
  if (href) {
    return (
      <Link href={href} className={`${className} hover:border-accent`}>{inner}</Link>
    );
  }
  return <div className={`${className} opacity-60`}>{inner}</div>;
}
