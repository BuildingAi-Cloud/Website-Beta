import { NextResponse } from "next/server";
import { loadPublicKeyB64 } from "@/lib/onprem-license-server";

// Returns the BuildingSync Ed25519 public key that on-prem appliances
// use to verify signed license responses. The key is embedded in each
// appliance image at build time so this endpoint is mostly a courtesy
// (lets us rotate keys without re-shipping the appliance, by serving
// both old and new during a transition).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const publicKey = await loadPublicKeyB64();
    return NextResponse.json(
      { algorithm: "Ed25519", format: "spki-base64", public_key: publicKey },
      { headers: { "Cache-Control": "public, max-age=300", ...CORS } },
    );
  } catch (err) {
    console.error("[onprem/public-key]", err);
    return new NextResponse(
      JSON.stringify({ error: "server_misconfigured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS } },
    );
  }
}
