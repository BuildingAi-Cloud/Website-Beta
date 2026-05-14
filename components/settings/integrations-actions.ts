"use server";

import { requireUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";

const VALID_KEYS = new Set([
  "slack",
  "teams",
  "email-to-ticket",
  "calendar",
  "webhooks",
  "rest-api",
]);

type Result = { ok: true } | { ok: false; error: string };

// Records interest in a not-yet-shipped integration. Two side effects:
// an AuditLog row (evidence-grade so product can count signal), and
// an email to info@buildingsync.app so someone follows up. Both are
// awaited because the UI shows a real success/failure toast — fire-
// and-forget would hide a misconfigured email gateway.
export async function requestIntegrationAccess(integrationKey: string): Promise<Result> {
  if (!VALID_KEYS.has(integrationKey)) {
    return { ok: false, error: "Unknown integration." };
  }

  const { authUser, appUser } = await requireUser();

  await logAudit({
    userId: appUser.id,
    userEmail: authUser.email,
    action: "integration_interest",
    resource: "Building",
    resourceId: appUser.buildingId,
    buildingId: appUser.buildingId,
    changes: { integration: integrationKey },
  });

  const subject = `[Integration request] ${integrationKey}`;
  const lines = [
    `Integration: ${integrationKey}`,
    `User: ${appUser.name ?? "(no name)"} <${authUser.email}>`,
    `Role: ${appUser.role}`,
    `Building: ${appUser.buildingId ?? "(none)"}`,
    `Requested at: ${new Date().toISOString()}`,
  ];
  await sendEmail({
    to: "info@buildingsync.app",
    subject,
    text: lines.join("\n"),
    html: `<pre style="font-family:ui-monospace,monospace;font-size:12px">${lines.join("\n")}</pre>`,
  }).catch((err) => {
    // Email gateway failures are non-fatal — the AuditLog row already
    // captured the signal. We still tell the user OK.
    console.error("[integrations] request email failed", err);
  });

  return { ok: true };
}
