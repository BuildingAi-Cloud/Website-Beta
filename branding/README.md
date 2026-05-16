# Branding

This folder is the white-label control surface. Anyone deploying
BuildingSync under a customer's brand starts here.

## Anatomy

```
branding/
├── README.md              ← you are here
├── default-brand.json     ← canonical BuildingSync token values
│
├── marketing/             ← public marketing surface
├── auth/                  ← /signin, /signup, /auth/*
├── portal-resident/       ← /dashboard (resident PWA)
├── portal-team/           ← /team (BM / FM / concierge)
├── portal-platform/       ← /platform (BuildingSync admin)
├── pwa/                   ← installed PWA + manifest
├── email/                 ← transactional email templates
└── github/                ← repo-public-facing brand (README, .github)
```

Each page-type folder has a `README.md` that lists:

1. **Routes covered** — exact paths under that surface.
2. **Brand surfaces** — which `lib/brand.ts` tokens render where.
3. **Static assets** — images, icons, manifest pieces.
4. **Override checklist** — minimum changes for white-label.
5. **Test checklist** — quick visual sweep to confirm the swap.

## How white-labeling works

1. Spin up a dedicated Vercel project + Supabase project for the
   customer (Enterprise tier).
2. Set the `NEXT_PUBLIC_BRAND_*` env vars (see [`.env.example`](../.env.example)).
3. Replace static assets in `public/` (icons, OG image, favicon).
4. Set `RESEND_FROM_EMAIL` and confirm the customer's domain in Resend.
5. Walk each page-type folder's test checklist on a staging URL.
6. Point the customer's custom domain at the deployment.

No code edits. Brand tokens are read from env at build time by
[`lib/brand.ts`](../lib/brand.ts) and propagated into the manifest,
shell footer, and PWA install prompts.

## Tiers

- **Co-branded** — customer brand is prominent; small "Powered by
  BuildingSync" line stays in the footer (`NEXT_PUBLIC_BRAND_SHOW_POWERED_BY=true`).
- **Fully unbranded** — no BuildingSync mark visible anywhere on the
  resident surface (`NEXT_PUBLIC_BRAND_SHOW_POWERED_BY=false`).

Both tiers swap the same set of assets and tokens; the toggle is just
the footer attribution line.

## Email branding status (R1)

Body copy, subjects, support email, and parent attribution all flow
from `lib/brand.ts`. CTA button colour and the cream card palette
remain hardcoded — both are R2 nice-to-haves, not launch blockers
for either Co-branded or Fully Unbranded tier. See
[`email/README.md`](./email/README.md) for the field-by-field map.
