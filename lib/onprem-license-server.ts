import { webcrypto } from "node:crypto";

// On-prem license server primitives — Ed25519 signing of verify
// responses + helpers for parsing PEM-style keys from env vars. The
// matching public key ships with each on-prem appliance image so it
// can verify responses locally and defend against TLS-stripped MITM.
//
// Why Ed25519: small (32-byte signatures), fast, and supported by
// Node's built-in WebCrypto since 18.4 — no native dep required.
//
// Env vars (see .env.example):
//   ONPREM_LICENSE_PRIVATE_KEY_B64  — base64 PKCS8 Ed25519 private key
//   ONPREM_LICENSE_PUBLIC_KEY_B64   — base64 SPKI Ed25519 public key
//
// Generate with: node scripts/generate-onprem-keys.mjs

export type OnpremLicenseResponse = {
  valid: boolean;
  reason?: "expired" | "revoked" | "fingerprint_mismatch" | "version_unsupported" | "not_found";
  customer_org?: string;
  expires_at?: string;      // ISO
  features?: string[];
  max_buildings?: number;
  max_units?: number;
  signed_until?: string;    // ISO — appliance can stay offline until this
};

export type OnpremVerifyRequest = {
  license_key: string;
  appliance_id: string;
  version: string;
  fingerprint: string;
};

// Canonical JSON serialisation (sorted keys, no whitespace) so the
// signature is reproducible. The appliance does the same on its side.
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(",")}}`;
}

// Return type intentionally inferred — Node's webcrypto.CryptoKey is
// a structurally-wider type than DOM lib's global CryptoKey (includes
// newer ML-KEM usages), so an explicit annotation conflicts.
async function loadPrivateKey() {
  const b64 = process.env.ONPREM_LICENSE_PRIVATE_KEY_B64;
  if (!b64) throw new Error("ONPREM_LICENSE_PRIVATE_KEY_B64 not set");
  const pkcs8 = Buffer.from(b64.trim(), "base64");
  return webcrypto.subtle.importKey(
    "pkcs8",
    pkcs8,
    { name: "Ed25519" },
    false,
    ["sign"],
  );
}

export async function loadPublicKeyB64(): Promise<string> {
  const b64 = process.env.ONPREM_LICENSE_PUBLIC_KEY_B64;
  if (!b64) throw new Error("ONPREM_LICENSE_PUBLIC_KEY_B64 not set");
  return b64.trim();
}

// Sign a response payload. Returns the signature base64-encoded.
// Signature covers the canonical JSON of the payload sans the
// `signature` field itself.
export async function signLicenseResponse(
  payload: Omit<OnpremLicenseResponse, "signature">,
): Promise<string> {
  const key = await loadPrivateKey();
  const message = new TextEncoder().encode(canonicalJson(payload));
  const sig = await webcrypto.subtle.sign({ name: "Ed25519" }, key, message);
  return Buffer.from(sig).toString("base64");
}

// Default cached-validity window: 7 days. Tunable so we can ship a
// shorter window for spot-revocation if a customer ever gets weird.
export const DEFAULT_SIGNED_UNTIL_DAYS = 7;
