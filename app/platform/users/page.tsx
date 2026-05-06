import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform";
import { prisma } from "@/lib/prisma";
import { updateUser } from "./actions";

const ROLES = [
  "resident",
  "tenant",
  "concierge",
  "facility_manager",
  "building_manager",
  "platform_admin",
] as const;

export default async function UsersPage() {
  const { appUser } = await requirePlatformAdmin();

  const [users, buildings] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { email: "asc" }],
      include: {
        building: { select: { name: true } },
        unit: { select: { unitNumber: true } },
      },
    }),
    prisma.building.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Users</h1>
          <p className="mt-1 text-sm opacity-60">{users.length} total</p>
        </div>
        <Link href="/platform" className="text-sm opacity-70 hover:opacity-100">← Back to platform</Link>
      </div>

      <table className="mt-8 w-full text-sm border-collapse">
        <thead>
          <tr className="text-left opacity-60">
            <th className="py-2 pr-4 font-medium">Email</th>
            <th className="py-2 pr-4 font-medium">Role</th>
            <th className="py-2 pr-4 font-medium">Building</th>
            <th className="py-2 pr-4 font-medium">Unit</th>
            <th className="py-2 pl-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isMe = u.id === appUser.id;
            return (
              <tr key={u.id} className="border-t" style={{ borderColor: "currentColor" }}>
                <td className="py-3 pr-4 align-top">
                  <div className="font-medium">{u.email}</div>
                  {isMe && <div className="text-xs opacity-50">that's you</div>}
                </td>
                <td className="py-3 pr-4 align-top">
                  <form action={updateUser} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="buildingId" value={u.buildingId ?? ""} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="px-2 py-1 rounded-md border bg-transparent text-sm"
                      style={{ borderColor: "currentColor" }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r.replace("_", " ")}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="text-xs px-2 py-1 rounded-md border opacity-70 hover:opacity-100"
                      style={{ borderColor: "currentColor" }}
                    >
                      Save role
                    </button>
                  </form>
                </td>
                <td className="py-3 pr-4 align-top">
                  <form action={updateUser} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="role" value={u.role} />
                    <select
                      name="buildingId"
                      defaultValue={u.buildingId ?? ""}
                      className="px-2 py-1 rounded-md border bg-transparent text-sm"
                      style={{ borderColor: "currentColor" }}
                    >
                      <option value="">— none —</option>
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="text-xs px-2 py-1 rounded-md border opacity-70 hover:opacity-100"
                      style={{ borderColor: "currentColor" }}
                    >
                      Save bldg
                    </button>
                  </form>
                </td>
                <td className="py-3 pr-4 align-top">
                  {u.unit ? `Unit ${u.unit.unitNumber}` : <span className="opacity-40">—</span>}
                </td>
                <td className="py-3 pl-4 align-top text-right opacity-60 text-xs">
                  joined {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="mt-8 text-xs opacity-50">
        Unit assignment, invite-by-email, and CSV bulk-onboarding land post-launch. For now, residents/tenants self-sign-up at /signup, then promote here.
      </p>
    </main>
  );
}
