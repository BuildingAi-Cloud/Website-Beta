import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

// Persist a Web Push subscription for the current user. Idempotent
// per endpoint — if the user resubscribes from the same browser,
// we update the existing row rather than create a duplicate.

export const dynamic = "force-dynamic";

type SubscribeBody = {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
};

export async function POST(request: Request) {
  try {
    const session = await getApiUser(request);
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { appUser } = session;
    const body = (await request.json().catch(() => ({}))) as SubscribeBody;

    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || null;

    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: body.endpoint },
    });

    if (existing) {
      await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          userId: appUser.id, // re-bind if the device changed accounts
          p256dh: body.keys.p256dh,
          auth: body.keys.auth,
          userAgent,
        },
      });
      return NextResponse.json({ ok: true, id: existing.id, updated: true });
    }

    const id = randomUUID();
    await prisma.pushSubscription.create({
      data: {
        id,
        userId: appUser.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        userAgent,
      },
    });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[push/subscribe] failed", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
