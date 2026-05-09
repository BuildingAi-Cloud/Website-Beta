import "server-only";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Web Push helper. Lazily configures VAPID + exposes a `sendPush`
// that fans out to every subscription a user has (multiple devices)
// and prunes endpoints the push service has rejected as gone (404 /
// 410 — most often the user uninstalled the PWA or revoked
// permission). Server-only — never bundle into client code.

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:info@buildingsync.app";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export function isPushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

// Send a push to every subscription registered to a user. Returns the
// number of successful deliveries. Failures from gone endpoints (404,
// 410) prune the subscription. Other failures are logged but the
// caller doesn't need to await them — push is fire-and-forget.
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
): Promise<{ sent: number; pruned: number }> {
  if (!ensureConfigured()) return { sent: 0, pruned: 0 };

  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return { sent: 0, pruned: 0 };

  const body = JSON.stringify(payload);
  let sent = 0;
  let pruned = 0;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
        );
        sent += 1;
        // Best-effort timestamp; failures are non-fatal.
        prisma.pushSubscription
          .update({ where: { id: sub.id }, data: { lastUsedAt: new Date() } })
          .catch(() => {});
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          // Push service says this endpoint is permanently gone.
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          pruned += 1;
        } else {
          console.error("[push] sendNotification failed", { userId, status, err });
        }
      }
    }),
  );

  return { sent, pruned };
}

// Fan-out to many users. Used for announcement broadcasts.
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
): Promise<{ sent: number; pruned: number }> {
  let sent = 0;
  let pruned = 0;
  await Promise.all(
    userIds.map(async (id) => {
      const result = await sendPushToUser(id, payload);
      sent += result.sent;
      pruned += result.pruned;
    }),
  );
  return { sent, pruned };
}
