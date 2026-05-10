"use server";

import { revalidatePath } from "next/cache";
import { requireTeam } from "@/lib/team";
import { rotateInviteCode } from "@/lib/invite-code";
import { logAuditFireAndForget } from "@/lib/audit";

export type RotateResult = { ok: true; code: string } | { ok: false; error: string };

export async function rotateBuildingInviteCode(): Promise<RotateResult> {
  const { authUser, appUser } = await requireTeam();
  if (appUser.role !== "building_manager") {
    return { ok: false, error: "Only the Building Manager can rotate the invite code." };
  }
  if (!appUser.buildingId) {
    return { ok: false, error: "No building on your account." };
  }

  try {
    const code = await rotateInviteCode(appUser.buildingId);
    logAuditFireAndForget({
      userId: appUser.id,
      userEmail: authUser.email,
      buildingId: appUser.buildingId,
      action: "invite_code.rotate",
      resource: "Building",
      resourceId: appUser.buildingId,
    });
    revalidatePath("/team/access-requests");
    return { ok: true, code };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
