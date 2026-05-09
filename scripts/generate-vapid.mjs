#!/usr/bin/env node
// Generate a VAPID keypair for Web Push. Print as env-var lines so
// you can append to .env.local or paste into Vercel env settings.
//
// Run: node scripts/generate-vapid.mjs

import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log("# Web Push (VAPID) — generated " + new Date().toISOString());
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("VAPID_SUBJECT=mailto:info@buildingsync.app");
