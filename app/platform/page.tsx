import { requirePlatformAdmin } from "@/lib/platform";
import { prisma } from "@/lib/prisma";

export default async function PlatformDashboard() {
  const { authUser } = await requirePlatformAdmin();

  const [buildings, totalUsers, totalUnits, totalWorkOrders] = await Promise.all([
    prisma.building.findMany({
      include: {
        _count: { select: { users: true, units: true, workOrders: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
    prisma.unit.count(),
    prisma.workOrder.count(),
  ]);

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold">Welcome, platform admin</h1>
      <p className="mt-2 opacity-70">{authUser.email}</p>

      <div className="mt-8 grid sm:grid-cols-4 gap-3">
        <Stat label="Buildings" value={buildings.length} />
        <Stat label="Users" value={totalUsers} />
        <Stat label="Units" value={totalUnits} />
        <Stat label="Work orders" value={totalWorkOrders} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Buildings</h2>
        {buildings.length === 0 ? (
          <p className="mt-2 text-sm opacity-70">No buildings yet.</p>
        ) : (
          <ul className="mt-3 divide-y" style={{ borderColor: "currentColor" }}>
            {buildings.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs opacity-60 truncate">
                    {b.address}, {b.city}, {b.state} {b.zipCode}
                  </div>
                </div>
                <div className="flex gap-4 text-sm opacity-70 whitespace-nowrap">
                  <span>{b._count.users} users</span>
                  <span>{b._count.units} units</span>
                  <span>{b._count.workOrders} WO</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-xs opacity-50">
        Onboarding stats, billing, support tools, and the building → owner mapping land post-launch.
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-md border" style={{ borderColor: "currentColor" }}>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="text-sm opacity-60 mt-1">{label}</div>
    </div>
  );
}
