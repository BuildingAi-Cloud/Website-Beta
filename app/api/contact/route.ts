import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const TO = process.env.CONTACT_INBOX || "info@buildingsync.app";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().toLowerCase(),
  topic: z.enum(["pilot", "enterprise", "support", "press", "other"]).default("other"),
  message: z.string().trim().min(10).max(4000),
  // Honeypot — real humans don't see/fill this. Bots will.
  company: z.string().optional(),
});

const TOPIC_LABEL: Record<string, string> = {
  pilot: "Pilot interest",
  enterprise: "Enterprise / Government",
  support: "Support",
  press: "Press",
  other: "General",
};

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = Body.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  // Silently drop honeypot hits — looks the same as a successful POST so
  // bots don't learn the field is the trap.
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { name, email, topic, message } = parsed.data;
  const subject = `[Contact · ${TOPIC_LABEL[topic]}] ${name}`;

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,sans-serif;color:#141414;">
<h2 style="margin:0 0 8px;">${escape(TOPIC_LABEL[topic])}</h2>
<p style="margin:0 0 16px;color:#666;">From <strong>${escape(name)}</strong> &lt;<a href="mailto:${escape(email)}">${escape(email)}</a>&gt;</p>
<div style="white-space:pre-wrap;border-left:3px solid #d35a3f;padding:8px 12px;background:#faf7f1;">${escape(message)}</div>
</body></html>`;

  const text = `${TOPIC_LABEL[topic]}
From: ${name} <${email}>

${message}`;

  try {
    await sendEmail({
      to: TO,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[contact] sendEmail failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
