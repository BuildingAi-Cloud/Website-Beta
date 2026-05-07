import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface LogAuditArgs {
  userId: string | null;
  userEmail?: string | null;
  action: string; // free-form verb: "create", "role_change", "status_change", "password_reset", etc.
  resource: "User" | "WorkOrder" | "Announcement" | "Building" | "Unit" | "Lease" | "Payment" | string;
  resourceId?: string | null;
  buildingId?: string | null;
  changes?: Record<string, unknown> | null;
  status?: "success" | "error";
  errorMessage?: string | null;
}

// Append-only audit trail. Matches the live DB AuditLog shape (userId/
// resource/resourceId/changes/status). Calls are fire-and-forget —
// a failed audit write must never block the user-facing action.
export async function logAudit(args: LogAuditArgs): Promise<void> {
  try {
    const reqHeaders = await headers().catch(() => null);
    const ipAddress =
      reqHeaders?.get("x-forwarded-for")?.split(",")[0].trim() ||
      reqHeaders?.get("x-real-ip") ||
      null;
    const userAgent = reqHeaders?.get("user-agent") ?? null;

    await prisma.auditLog.create({
      data: {
        id: randomUUID(),
        userId: args.userId,
        userEmail: args.userEmail ?? null,
        buildingId: args.buildingId ?? null,
        action: args.action,
        resource: args.resource,
        resourceId: args.resourceId ?? null,
        changes:
          args.changes === undefined || args.changes === null
            ? Prisma.DbNull
            : (args.changes as Prisma.InputJsonValue),
        ipAddress,
        userAgent,
        status: args.status ?? "success",
        errorMessage: args.errorMessage ?? null,
      },
    });
  } catch (err) {
    // Don't crash the calling action if the audit write fails.
    console.error("[audit] failed to record event", { args, err });
  }
}

// Fire-and-forget wrapper — most callers should use this so a slow
// audit write doesn't block the request.
export function logAuditFireAndForget(args: LogAuditArgs): void {
  void logAudit(args);
}
