import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";

export default async function TeamResidentsPage() {
  const { appUser } = await requireTeam();

  if (!appUser.buildingId) {
    return (
      <main className="px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight">Residents</h1>
        <p className="mt-3 text-sm text-muted-foreground">No building assigned to your account.</p>
      </main>
    );
  }

  const residents = await prisma.user.findMany({
    where: {
      buildingId: appUser.buildingId,
      role: { in: ["resident", "tenant"] },
    },
    include: { unit: { select: { unitNumber: true } } },
    orderBy: [{ role: "asc" }, { email: "asc" }],
  });

  return (
    <main className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight">Residents</h1>
      <p className="mt-1 text-sm text-muted-foreground">{residents.length} in this building</p>

      {residents.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No residents linked yet.</p>
      ) : (
        <div className="mt-8 bg-card border border-border rounded-md overflow-hidden">
          <ul className="divide-y divide-border">
            {residents.map((r) => (
              <li key={r.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.name || r.email}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                </div>
                <div className="text-sm flex items-center gap-3 shrink-0">
                  {r.unit && <span className="text-muted-foreground">Unit {r.unit.unitNumber}</span>}
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border border-border bg-muted/30">
                    {r.role}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Inviting + unit-assignment land in next iteration. For R1, residents self-sign-up at /signup, then promote here.
      </p>
    </main>
  );
}
