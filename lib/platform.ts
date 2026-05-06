import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

// Platform admin = BuildingSync company staff. Distinct from a building's
// own building_manager. Lives at admin.buildingsync.app, sees every
// customer building rather than just one.
export async function requirePlatformAdmin() {
  const session = await requireUser();
  if (session.appUser.role !== "platform_admin") {
    // Send non-platform users to the role-aware root, which will route
    // them to the surface that matches their role on the right host.
    redirect("/");
  }
  return session;
}
