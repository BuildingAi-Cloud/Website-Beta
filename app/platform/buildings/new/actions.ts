"use server";

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
  timezone: z.string().trim().min(1).max(60).default("America/New_York"),
});

export async function createBuilding(formData: FormData) {
  await requirePlatformAdmin();

  const parsed = Body.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    timezone: formData.get("timezone") || "America/New_York",
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }

  await prisma.building.create({ data: parsed.data });

  revalidatePath("/platform");
  revalidatePath("/platform/users");
  redirect("/platform");
}
