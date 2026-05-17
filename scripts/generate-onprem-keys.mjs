#!/usr/bin/env node
// One-shot Ed25519 keypair generator for on-prem license signing.
//
// Outputs two base64 strings to stdout — paste them into Vercel env
// vars (production) and into .env.local (local dev). The PUBLIC key
// also gets embedded in each on-prem appliance image at build time.
//
// Usage:
//   node scripts/generate-onprem-keys.mjs

import { webcrypto } from "node:crypto";

const { publicKey, privateKey } = await webcrypto.subtle.generateKey(
  { name: "Ed25519" },
  true,
  ["sign", "verify"],
);

const [pkcs8, spki] = await Promise.all([
  webcrypto.subtle.exportKey("pkcs8", privateKey),
  webcrypto.subtle.exportKey("spki", publicKey),
]);

const privB64 = Buffer.from(pkcs8).toString("base64");
const pubB64 = Buffer.from(spki).toString("base64");

console.log("# ─── BuildingSync on-prem license signing keypair ─────");
console.log("# Generated:", new Date().toISOString());
console.log("# Algorithm: Ed25519");
console.log("# Paste into Vercel env vars (production) AND .env.local:");
console.log("");
console.log(`ONPREM_LICENSE_PRIVATE_KEY_B64=${privB64}`);
console.log(`ONPREM_LICENSE_PUBLIC_KEY_B64=${pubB64}`);
console.log("");
console.log("# The PUBLIC key (only) also needs to be baked into each");
console.log("# on-prem appliance image so it can verify signed responses.");
console.log("# Never share the PRIVATE key with anyone — it lets the");
console.log("# holder sign valid licenses for any customer.");
