import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  signLicenseResponse,
  DEFAULT_SIGNED_UNTIL_DAYS,
  type OnpremLicenseResponse,
  type OnpremVerifyRequest,
} from "@/lib/onprem-license-server";

// Public endpoint the on-prem appliance hits every 24h. Validates the
// license key, checks expiry + revocation, returns an Ed25519-signed
// response the appliance can cache for ~7 days of offline operation.
//
// No auth — the license key itself is the credential. Rate limit at
// the edge (Vercel WAF) if abuse becomes a problem.

const Body = z.object({
  license_key: z.string().trim().min(8).max(128),
  appliance_id: z.string().trim().min(8).max(128),
  version: z.string().trim().max(32),
  fingerprint: z.string().trim().min(8).max(256),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function build(payload: Omit<OnpremLicenseResponse, "signature">) {
  const signature = await signLicenseResponse(payload);
  return NextResponse.json({ ...payload, signature }, { headers: CORS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: NextRequest) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new NextResponse(JSON.stringify({ valid: false, reason: "not_found" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }
  const body: OnpremVerifyRequest = parsed.data;

  const lic = await prisma.onpremLicense.findUnique({
    where: { licenseKey: body.license_key },
  });

  // Unknown key — return signed valid:false so the appliance knows
  // the response wasn't tampered with.
  if (!lic) return build({ valid: false, reason: "not_found" });

  // Revoked.
  if (lic.revokedAt) return build({ valid: false, reason: "revoked" });

  // Expired.
  if (lic.expiresAt.getTime() < Date.now()) {
    return build({ valid: false, reason: "expired" });
  }

  // First-time check-in — record fingerprint + appliance_id.
  // Subsequent calls with a different fingerprint are rejected.
  if (!lic.applianceFingerprint) {
    await prisma.onpremLicense.update({
      where: { id: lic.id },
      data: {
        applianceId: body.appliance_id,
        applianceFingerprint: body.fingerprint,
        lastCheckedAt: new Date(),
        lastReportedVersion: body.version,
        lastReportedIp: clientIp(request),
      },
    });
  } else if (lic.applianceFingerprint !== body.fingerprint) {
    return build({ valid: false, reason: "fingerprint_mismatch" });
  } else {
    // Same appliance checking in — update observability fields.
    await prisma.onpremLicense.update({
      where: { id: lic.id },
      data: {
        lastCheckedAt: new Date(),
        lastReportedVersion: body.version,
        lastReportedIp: clientIp(request),
      },
    });
  }

  const signedUntil = new Date(Date.now() + DEFAULT_SIGNED_UNTIL_DAYS * 24 * 60 * 60 * 1000);

  return build({
    valid: true,
    customer_org: lic.customerOrg,
    expires_at: lic.expiresAt.toISOString(),
    features: lic.features,
    max_buildings: lic.maxBuildings,
    max_units: lic.maxUnits,
    signed_until: signedUntil.toISOString(),
  });
}

function clientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip") ?? null;
}
