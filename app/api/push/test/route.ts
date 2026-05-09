import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { sendPushToUser, isPushConfigured } from "@/lib/push";

// User-triggered test push. Sends a notification to every device the
// current user has subscribed. Used by the "Send test notification"
// button on the Notifications settings tab.

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    if (!isPushConfigured()) {
      return NextResponse.json(
        { error: "Push notifications are not configured on this server (VAPID keys missing)." },
        { status: 503 },
      );
    }

    const { appUser } = await requireUser();

    const result = await sendPushToUser(appUser.id, {
      title: "BuildingSync test notification",
      body: "If you can see this, push notifications are working on this device.",
      url: "/dashboard",
      tag: "push-test",
    });

    if (result.sent === 0) {
      return NextResponse.json(
        { error: "No active subscriptions for your account on this server. Re-enable push from your device first." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, sent: result.sent, pruned: result.pruned });
  } catch (err) {
    console.error("[push/test] failed", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
