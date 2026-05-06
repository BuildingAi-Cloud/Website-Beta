"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  email: z.string().email().toLowerCase(),
  role: z.enum(["resident", "tenant"]),
  unitId: z.string().nullable(),
});

type Result =
  | { ok: true; email: string; password: string | null; message: string }
  | { ok: false; error: string };

const ALLOWED_ROLES = ["building_manager", "facility_manager"];

export async function addResident(_prev: unknown, formData: FormData): Promise<Result> {
  const session = await requireTeam();
  if (!ALLOWED_ROLES.includes(session.appUser.role)) {
    return { ok: false, error: "Only Building Managers and Facility Managers can add residents." };
  }
  if (!session.appUser.buildingId) {
    return { ok: false, error: "Your account is not linked to a building." };
  }

  const parsed = Body.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || "resident",
    unitId: (formData.get("unitId") as string) || null,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  }
  const { email, role, unitId } = parsed.data;

  // If the unit was provided, verify it belongs to this building.
  if (unitId) {
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit || unit.buildingId !== session.appUser.buildingId) {
      return { ok: false, error: "Unit doesn't belong to your building." };
    }
  }

  // Existing user? Re-link to this building/unit/role rather than re-creating.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role,
        buildingId: session.appUser.buildingId,
        unitId: unitId,
      },
    });
    revalidatePath("/team/residents");
    return { ok: true, email, password: null, message: `Re-linked existing account.` };
  }

  // New user — create via Supabase Auth.
  const password = generatePassword();
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user?.id) {
    return { ok: false, error: error?.message || "Supabase didn't return a user id (rate limit?)." };
  }

  await prisma.user.create({
    data: {
      id: data.user.id,
      email,
      role,
      buildingId: session.appUser.buildingId,
      unitId: unitId,
    },
  });

  revalidatePath("/team/residents");
  return {
    ok: true,
    email,
    password,
    message: "Account created. Share the temporary password with them.",
  };
}

function generatePassword(): string {
  // 14-char alphanumeric, easy to share verbally / over chat.
  return randomBytes(12).toString("base64").replace(/[+/=lI0Oo]/g, "").slice(0, 14);
}
