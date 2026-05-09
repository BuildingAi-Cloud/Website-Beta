import { createHmac, timingSafeEqual } from "node:crypto";

// Signed-license format: `<base64url(payload-json)>.<base64url(signature)>`
// where signature = HMAC-SHA256(payload, LICENSE_SIGNING_SECRET).
//
// HMAC is intentional rather than asymmetric (ed25519) for R1.5 — it's
// simpler to operate, and SaaS customers don't need offline verification.
// On-prem hardening to ed25519 lands when the on-prem package ships.

export type LicensePayload = {
  customer: string;
  product?: string;
  plan?: string;
  mode?: "saas" | "on_prem";
  seatLimit?: number;
  expiresAt?: string; // ISO date
  capabilities?: string[];
  aiEnabled?: boolean;
};

function getSecret(): string {
  const secret = process.env.LICENSE_SIGNING_SECRET;
  if (!secret) throw new Error("LICENSE_SIGNING_SECRET is not set");
  return secret;
}

function b64urlEncode(buf: Buffer | Uint8Array): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecodeToBuffer(s: string): Buffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

export function signLicense(payload: LicensePayload): string {
  const json = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(Buffer.from(json, "utf8"));
  const sig = createHmac("sha256", getSecret()).update(payloadB64).digest();
  return `${payloadB64}.${b64urlEncode(sig)}`;
}

export type ValidatedLicense =
  | { ok: true; payload: LicensePayload }
  | { ok: false; error: string };

export function verifyLicense(key: string): ValidatedLicense {
  const parts = key.trim().split(".");
  if (parts.length !== 2) return { ok: false, error: "Invalid format. Expected payload.signature." };

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return { ok: false, error: "Invalid format." };

  let secret: string;
  try {
    secret = getSecret();
  } catch (err) {
    const message = err instanceof Error ? err.message : "License verification not configured.";
    return { ok: false, error: message };
  }

  const expected = createHmac("sha256", secret).update(payloadB64).digest();
  const provided = b64urlDecodeToBuffer(sigB64);
  if (provided.length !== expected.length) return { ok: false, error: "Signature mismatch." };
  if (!timingSafeEqual(provided, expected)) return { ok: false, error: "Signature mismatch." };

  let payload: LicensePayload;
  try {
    const json = b64urlDecodeToBuffer(payloadB64).toString("utf8");
    payload = JSON.parse(json);
  } catch {
    return { ok: false, error: "Could not decode payload." };
  }

  if (!payload.customer || typeof payload.customer !== "string") {
    return { ok: false, error: "Payload missing customer." };
  }
  if (payload.expiresAt) {
    const exp = new Date(payload.expiresAt);
    if (Number.isNaN(exp.getTime())) return { ok: false, error: "Invalid expiresAt." };
    if (exp < new Date()) return { ok: false, error: "License has expired." };
  }

  return { ok: true, payload };
}

export function daysRemaining(expiresAt: Date | null | undefined): number | null {
  if (!expiresAt) return null;
  const ms = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
