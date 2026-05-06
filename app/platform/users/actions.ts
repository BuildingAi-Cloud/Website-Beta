"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePlatformAdmin } from "@/lib/platform";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  userId: z.string().uuid(),
  role: z.enum([
    "resident",
    "tenant",
    "concierge",
    "facility_manager",
    "building_manager",
    "platform_admin",
  ]),
  buildingId: z.string().min(1).nullable(),
});

const NON_RESIDENT = ["building_manager", "facility_manager", "concierge", "platform_admin"];

export async function updateUser(formData: FormData) {
  await requirePlatformAdmin();

  const parsed = Body.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
    buildingId: formData.get("buildingId") || null,
  });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
  }

  const { userId, role, buildingId } = parsed.data;

  await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      buildingId: buildingId === "" ? null : buildingId,
      // Strip the unit assignment when promoting someone to a non-resident role.
      ...(NON_RESIDENT.includes(role) ? { unitId: null } : {}),
    },
  });

  revalidatePath("/platform/users");
  revalidatePath("/platform");
}
