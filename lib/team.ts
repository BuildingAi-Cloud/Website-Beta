import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { requireUser } from "@/lib/auth";

// Building-side staff. Owners/managers of a single building manage their
// own residents + tenants here. The BuildingSync platform admin is a
// separate surface (lib/platform.ts) at admin.buildingsync.app.
const TEAM_ROLES: UserRole[] = ["building_manager", "facility_manager", "concierge"];

export async function requireRole(allowed: UserRole[]) {
  const session = await requireUser();
  if (!allowed.includes(session.appUser.role)) redirect("/dashboard");
  return session;
}

export async function requireTeam() {
  return requireRole(TEAM_ROLES);
}

export function canAssign(role: UserRole) {
  return role === "building_manager" || role === "facility_manager";
}
