import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";
import { WorkOrderRow } from "./WorkOrderRow";

export default async function TeamWorkOrdersPage() {
  const { appUser } = await requireTeam();

  if (!appUser.buildingId) {
    return (
      <main className="px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight">Work orders</h1>
        <p className="mt-3 text-sm text-muted-foreground">No building assigned to your account.</p>
      </main>
    );
  }

  const workOrders = await prisma.workOrder.findMany({
    where: { buildingId: appUser.buildingId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      openedBy: { select: { email: true, name: true } },
      unit: { select: { unitNumber: true } },
      assignedTo: { select: { email: true, name: true } },
    },
    take: 100,
  });

  const canAct = appUser.role === "facility_manager" || appUser.role === "building_manager";

  return (
    <main className="px-6 py-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Work orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{workOrders.length} total</p>
      </div>

      {workOrders.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          No work orders yet. Residents submit them from /dashboard/maintenance.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {workOrders.map((wo) => (
            <WorkOrderRow
              key={wo.id}
              workOrder={{
                id: wo.id,
                title: wo.title,
                description: wo.description,
                status: wo.status,
                createdAt: wo.createdAt.toISOString(),
                openedByLabel: wo.openedBy.name || wo.openedBy.email,
                unitLabel: wo.unit?.unitNumber || null,
                assignedToLabel: wo.assignedTo ? wo.assignedTo.name || wo.assignedTo.email : null,
              }}
              canAct={canAct}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
