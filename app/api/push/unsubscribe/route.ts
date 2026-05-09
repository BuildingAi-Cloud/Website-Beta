import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Remove a Web Push subscription. The client calls this after the
// browser revokes permission or the user toggles push off.

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { appUser } = await requireUser();
    const body = (await request.json().catch(() => ({}))) as { endpoint?: string };

    if (!body.endpoint) {
      return NextResponse.json({ error: "endpoint is required" }, { status: 400 });
    }

    // Scope to current user — can't unsubscribe someone else's device.
    const result = await prisma.pushSubscription.deleteMany({
      where: { endpoint: body.endpoint, userId: appUser.id },
    });

    return NextResponse.json({ ok: true, deleted: result.count });
  } catch (err) {
    console.error("[push/unsubscribe] failed", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
