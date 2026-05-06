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

// ─── Bulk CSV onboarding ────────────────────────────────────────────────

const CSV_ROLE_DEFAULT: "resident" | "tenant" = "resident";

type BulkRowOk = { row: number; email: string; password: string | null; status: "created" | "linked" };
type BulkRowErr = { row: number; email: string; error: string };
type BulkResult =
  | { ok: true; created: number; linked: number; rows: BulkRowOk[]; errors: BulkRowErr[] }
  | { ok: false; error: string };

export async function bulkAddResidents(_prev: unknown, formData: FormData): Promise<BulkResult> {
  const session = await requireTeam();
  if (!ALLOWED_ROLES.includes(session.appUser.role)) {
    return { ok: false, error: "Only Building Managers and Facility Managers can bulk-onboard residents." };
  }
  if (!session.appUser.buildingId) {
    return { ok: false, error: "Your account is not linked to a building." };
  }

  // Accept either a pasted textarea or an uploaded .csv file.
  let text = (formData.get("csv") as string | null) ?? "";
  const file = formData.get("file") as File | null;
  if (file && typeof file === "object" && "text" in file) {
    const fromFile = await file.text();
    if (fromFile.trim()) text = fromFile;
  }
  if (!text.trim()) {
    return { ok: false, error: "Paste CSV rows or upload a .csv file." };
  }

  // Build a unitNumber → unitId lookup so we don't hit Prisma per row.
  const units = await prisma.unit.findMany({
    where: { buildingId: session.appUser.buildingId },
    select: { id: true, unitNumber: true },
  });
  const unitByNumber = new Map(units.map((u) => [u.unitNumber.toLowerCase(), u.id]));

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const rows: BulkRowOk[] = [];
  const errors: BulkRowErr[] = [];
  let created = 0;
  let linked = 0;

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // Skip a header row if present.
  const startIdx = lines[0]?.toLowerCase().startsWith("email") ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const rowNum = i + 1;
    const cells = lines[i].split(",").map((c) => c.trim());
    const email = cells[0]?.toLowerCase() || "";
    const roleCell = (cells[1] || CSV_ROLE_DEFAULT).toLowerCase();
    const unitCell = cells[2] || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ row: rowNum, email, error: "missing or invalid email" });
      continue;
    }
    if (roleCell !== "resident" && roleCell !== "tenant") {
      errors.push({ row: rowNum, email, error: `invalid role "${roleCell}" (expected resident or tenant)` });
      continue;
    }
    const role = roleCell as "resident" | "tenant";
    const unitId = unitCell ? unitByNumber.get(unitCell.toLowerCase()) ?? null : null;
    if (unitCell && !unitId) {
      errors.push({ row: rowNum, email, error: `unit "${unitCell}" not found in this building` });
      continue;
    }

    const linkData = { role, buildingId: session.appUser.buildingId, unitId };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({ where: { id: existing.id }, data: linkData });
      rows.push({ row: rowNum, email, password: null, status: "linked" });
      linked++;
      continue;
    }

    const password = generatePassword();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user?.id) {
      errors.push({ row: rowNum, email, error: signUpError?.message || "signup returned no user id" });
      continue;
    }
    await prisma.user.create({
      data: { id: data.user.id, email, ...linkData },
    });
    rows.push({ row: rowNum, email, password, status: "created" });
    created++;
  }

  revalidatePath("/team/residents");
  return { ok: true, created, linked, rows, errors };
}
