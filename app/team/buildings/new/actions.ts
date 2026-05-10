"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";
import { logAuditFireAndForget } from "@/lib/audit";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(40),
  zipCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(1).max(40).default("Canada"),
  timezone: z.string().trim().min(1).max(60).default("America/Toronto"),
});

type Result = { ok: true } | { ok: false; error: string };

// BM self-serve building creation. Only allowed for verified BMs that
// don't already have a building — once linked, /team/buildings/new
// redirects out so we never end up with the same BM owning two buildings
// via the UI. Platform admin can still attach BMs to existing buildings
// from /platform/users when needed.
export async function createTeamBuilding(_prev: unknown, formData: FormData): Promise<Result> {
  const session = await requireTeam();

  if (session.appUser.role !== "building_manager") {
    return { ok: false, error: "Only Building Managers can create a building." };
  }
  if (session.appUser.buildingId) {
    return { ok: false, error: "You're already linked to a building. Contact platform support to switch." };
  }

  const parsed = Body.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: (formData.get("country") as string) || "Canada",
    timezone: (formData.get("timezone") as string) || "America/Toronto",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }

  const buildingId = randomUUID();
  await prisma.$transaction([
    prisma.building.create({
      data: { id: buildingId, type: "residential", ...parsed.data },
    }),
    prisma.user.update({
      where: { id: session.appUser.id },
      data: { buildingId },
    }),
  ]);

  logAuditFireAndForget({
    userId: session.appUser.id,
    userEmail: session.appUser.email,
    action: "building.create",
    resource: "Building",
    resourceId: buildingId,
    buildingId,
    changes: {
      source: "team_self_serve",
      name: parsed.data.name,
      city: parsed.data.city,
      state: parsed.data.state,
      country: parsed.data.country,
    },
  });

  revalidatePath("/team");
  redirect("/team");
}
