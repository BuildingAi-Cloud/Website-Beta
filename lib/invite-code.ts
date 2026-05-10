import { randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";

// 6-character building invite code. Excludes ambiguous chars (0/O/1/I/L)
// so users dictating it don't trip on lookalikes. Uppercase only.

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateInviteCode(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += ALPHABET[randomInt(0, ALPHABET.length)];
  return out;
}

export function normalizeInviteCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

// Find the building a code belongs to. Returns null on miss; caller
// surfaces a generic "invalid code" so we don't leak existence.
export async function findBuildingByInviteCode(code: string) {
  const normalized = normalizeInviteCode(code);
  if (normalized.length !== 6) return null;
  return prisma.building
    .findUnique({
      where: { inviteCode: normalized },
      select: { id: true, name: true, city: true },
    })
    .catch(() => null);
}

// Atomic regenerate — generates a fresh code and tries to claim it,
// retrying on the rare collision. Capped at 5 retries because at 6
// chars from a 31-char alphabet collisions are exceptionally rare.
export async function rotateInviteCode(buildingId: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    try {
      await prisma.building.update({
        where: { id: buildingId },
        data: { inviteCode: code, inviteCodeUpdatedAt: new Date() },
      });
      return code;
    } catch {
      // Likely a unique-constraint collision — try again.
    }
  }
  throw new Error("Could not allocate a unique invite code; try again.");
}
