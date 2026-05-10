import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User as AppUser } from "@prisma/client";
import { findBuildingByInviteCode, normalizeInviteCode } from "@/lib/invite-code";
import { logAuditFireAndForget } from "@/lib/audit";

// Reads the Supabase session, then upserts the app-side User row keyed by
// the Supabase auth.uid. New signups land here as `resident` with no
// building/unit until a Building Manager assigns them — unless they
// signed up with a building invite code, in which case we auto-link.
export async function getOrCreateAppUser(): Promise<{ authUser: AuthUser; appUser: AppUser } | null> {
  const supabase = await createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  let appUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email },
    create: { id: user.id, email: user.email, role: "resident" },
  });

  // First-touch invite-code application. The signup flow stores the
  // code in Supabase user_metadata; we apply it here once and clear
  // the metadata so it can't be replayed if the user later joins a
  // different building.
  const rawCode = (user.user_metadata?.invite_code as string | undefined) ?? null;
  if (rawCode && !appUser.buildingId) {
    const code = normalizeInviteCode(rawCode);
    if (code.length === 6) {
      const building = await findBuildingByInviteCode(code);
      if (building) {
        appUser = await prisma.user.update({
          where: { id: appUser.id },
          data: { buildingId: building.id },
        });
        logAuditFireAndForget({
          userId: appUser.id,
          userEmail: appUser.email,
          buildingId: building.id,
          action: "invite_code.redeem",
          resource: "User",
          resourceId: appUser.id,
          changes: { code },
        });
      }
    }
    await supabase.auth.updateUser({ data: { invite_code: null } }).catch(() => {});
  }

  return { authUser: user, appUser };
}

export async function requireUser() {
  const result = await getOrCreateAppUser();
  if (!result) redirect("/signin");
  return result;
}
