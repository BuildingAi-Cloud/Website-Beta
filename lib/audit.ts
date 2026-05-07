import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "role_change"
  | "status_change"
  | "password_reset"
  | "login"
  | "signout"
  | "export";

interface LogAuditArgs {
  actorId: string | null;
  action: AuditAction;
  entityType: "User" | "WorkOrder" | "Announcement" | "Building" | "Unit" | "Lease" | "Payment" | string;
  entityId: string;
  buildingId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}

// Append-only audit trail. Calls are fire-and-forget — a failed audit
// write must never block the user-facing action. We log to console as
// a fallback so the event isn't lost entirely.
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
        actorId: args.actorId,
        action: args.action,
        entityType: args.entityType,
        entityId: args.entityId,
        buildingId: args.buildingId ?? null,
        before: args.before === undefined ? Prisma.DbNull : (args.before as Prisma.InputJsonValue),
        after: args.after === undefined ? Prisma.DbNull : (args.after as Prisma.InputJsonValue),
        metadata: args.metadata === undefined ? Prisma.DbNull : (args.metadata as Prisma.InputJsonValue),
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    // Don't crash the calling action if the audit write fails — the
    // most likely cause is the AuditLog table not yet existing on a
    // freshly-deployed environment that hasn't run the migration.
    console.error("[audit] failed to record event", { args, err });
  }
}

// Fire-and-forget wrapper — most callers should use this so a slow
// audit write doesn't block the request.
export function logAuditFireAndForget(args: LogAuditArgs): void {
  void logAudit(args);
}
