"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePlatformAdmin } from "@/lib/platform";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(40),
  zipCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(1).max(40).default("Canada"),
  type: z.enum(["commercial", "residential", "mixed", "industrial"]).default("residential"),
  timezone: z.string().trim().min(1).max(60).default("America/Toronto"),
});

export async function createBuilding(formData: FormData) {
  await requirePlatformAdmin();

  const parsed = Body.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country") || "Canada",
    type: formData.get("type") || "residential",
    timezone: formData.get("timezone") || "America/Toronto",
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  await prisma.building.create({ data: { id: randomUUID(), ...parsed.data } });

  revalidatePath("/platform");
  revalidatePath("/platform/users");
  redirect("/platform");
}
