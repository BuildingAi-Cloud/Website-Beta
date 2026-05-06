"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["building_manager", "facility_manager"];

const Body = z.object({
  unitNumber: z.string().trim().min(1).max(20),
  floor: z.coerce.number().int().min(0).max(200).optional().nullable(),
  rentAmount: z.coerce.number().min(0).max(1_000_000).optional().nullable(),
});

type Result =
  | { ok: true; unitNumber: string }
  | { ok: false; error: string };

export async function addUnit(_prev: unknown, formData: FormData): Promise<Result> {
  const session = await requireTeam();
  if (!ALLOWED_ROLES.includes(session.appUser.role)) {
    return { ok: false, error: "Only Building Managers and Facility Managers can add units." };
  }
  if (!session.appUser.buildingId) {
    return { ok: false, error: "Your account is not linked to a building." };
  }

  const parsed = Body.safeParse({
    unitNumber: formData.get("unitNumber"),
    floor: formData.get("floor") || null,
    rentAmount: formData.get("rentAmount") || null,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const { unitNumber, floor, rentAmount } = parsed.data;

  try {
    await prisma.unit.create({
      data: {
        buildingId: session.appUser.buildingId,
        unitNumber,
        floor: floor ?? null,
        rentAmount: rentAmount ? new Prisma.Decimal(rentAmount) : null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, error: `Unit ${unitNumber} already exists in this building.` };
    }
    throw e;
  }

  revalidatePath("/team/units");
  revalidatePath("/team/residents");
  return { ok: true, unitNumber };
}
