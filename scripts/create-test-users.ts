// Bulk-create test users for the smoke build.
// Usage: npx tsx scripts/create-test-users.ts [password]
//
// Prereq: Supabase Auth → Email provider → "Confirm email" toggled OFF.
// Otherwise sign-ups will require manual link clicks for each address.

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { PrismaClient, type UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const TEST_USERS: Array<{ email: string; role: UserRole; assignToBuilding: boolean }> = [
  { email: "sinhaankur827+bm@gmail.com", role: "building_manager", assignToBuilding: true },
  { email: "sinhaankur827+fm@gmail.com", role: "facility_manager", assignToBuilding: true },
  { email: "sinhaankur827+concierge@gmail.com", role: "concierge", assignToBuilding: true },
  { email: "sinhaankur827+resident@gmail.com", role: "resident", assignToBuilding: true },
  { email: "sinhaankur827+tenant@gmail.com", role: "tenant", assignToBuilding: true },
];

const PASSWORD = process.argv[2] || "BuildingSync!2026";

async function main() {
  const building = await prisma.building.findFirst({ orderBy: { createdAt: "asc" } });
  if (!building) {
    console.error("No building found. Run: npx tsx prisma/seed.ts");
    process.exit(1);
  }
  const unit = await prisma.unit.findFirst({ where: { buildingId: building.id } });

  for (const u of TEST_USERS) {
    const { data, error } = await supabase.auth.signUp({ email: u.email, password: PASSWORD });

    let authId = data.user?.id;
    let status: "created" | "existing" | "error" = "created";

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        // Already in Supabase Auth. Look it up in our app User table.
        const existing = await prisma.user.findUnique({ where: { email: u.email } });
        if (!existing) {
          console.warn(`${u.email}: in Supabase Auth but no app row yet — sign in once via /signin so the upsert runs, then re-run this script.`);
          continue;
        }
        authId = existing.id;
        status = "existing";
      } else {
        console.error(`${u.email}: ${error.message}`);
        status = "error";
        continue;
      }
    }

    if (!authId) {
      console.warn(`${u.email}: no auth id returned — likely email confirmation is still ON. Disable it in Supabase and re-run.`);
      continue;
    }

    const isResident = u.role === "resident" || u.role === "tenant";
    await prisma.user.upsert({
      where: { id: authId },
      update: {
        email: u.email,
        role: u.role,
        buildingId: u.assignToBuilding ? building.id : null,
        unitId: isResident && unit ? unit.id : null,
      },
      create: {
        id: authId,
        email: u.email,
        role: u.role,
        buildingId: u.assignToBuilding ? building.id : null,
        unitId: isResident && unit ? unit.id : null,
      },
    });

    console.log(`${u.email.padEnd(40)} role=${u.role.padEnd(20)} ${status}`);
  }

  console.log(`\nAll passwords: ${PASSWORD}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
