# BuildingSync — Web (R1 production)

Cloud SKU. Next.js 16 + Supabase + Prisma + Stripe Checkout, deployed on Vercel.

> R&D and phased development happens in `BuildingAi-Cloud/BuildingSync-Lab`. This repo is the narrow production cut. Port forward; don't bidirectional-merge. The on-prem SKU lives at `BuildingAi-Cloud/BuildingSync-Onprem` (private).

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Auth + DB**: Supabase (SSR auth, Postgres)
- **ORM**: Prisma 7
- **Payments**: Stripe Checkout
- **PWA**: manifest + service worker (installable)
- **Deploy**: Vercel

## Domains

- `buildingsync.app` — marketing + resident/tenant portal
- `admin.buildingsync.app` — building manager / facility manager / concierge
  (same Next.js deployment, subdomain rewrite in `proxy.ts`)

## Quick start

```bash
cp .env.example .env.local   # fill Supabase + Stripe keys
npm install
npx prisma migrate dev       # apply schema to Supabase
npm run dev                  # http://localhost:3000
```

## R1 scope

Resident/tenant: sign in · maintenance request · announcements · pay rent (Stripe Checkout).
Admin: BM roster + invite, FM work-order queue, Concierge package log.
PWA: installable on mobile.

Out of R1 (lives in R&D): AI chat, governance, vendor portal, owner banks, OCR, marketplace, audit log UI, i18n, Stripe Connect.

## Sibling repos in this product family

| Repo                        | Role                                                                  |
| --------------------------- | --------------------------------------------------------------------- |
| **BuildingSync-Web** (here) | Cloud SKU — Next.js app on Vercel. **Canonical source.**             |
| BuildingSync-Onprem         | On-premise / air-gapped SKU (private)                                 |
| BuildingSync-Core           | Shared domain code package — mirrored from `packages/core/` here     |
| BuildingSync-OpenAPI        | API spec + generated TS/Swift/Kotlin clients — mirrored from `public/openapi.yaml` here |
| BuildingSync-iOS            | Native iOS client (SwiftUI)                                           |
| BuildingSync-Android        | Native Android client (Kotlin + Compose)                              |
| BuildingSync-Mobile         | TBD — shared React Native shell or retire                             |
| BuildingSync-Brand          | Brand assets — SVG marks, palette, typography                         |
| BuildingSync-Architecture   | Product architecture docs, persona maps, ticket plans                 |
| BuildingSync-Lab            | R&D — phased / experimental work                                      |

### Sync model

This repo is the **single source of truth** for code that ships to the live cloud
app at https://www.buildingsync.app. Two paths automatically replicate
canonical artefacts to their downstream repos:

- `public/openapi.yaml` changes → `BuildingSync-OpenAPI/openapi.yaml`
  via [.github/workflows/sync-openapi.yml](.github/workflows/sync-openapi.yml)
- `packages/core/**` changes → `BuildingSync-Core` (root) via
  [.github/workflows/sync-core.yml](.github/workflows/sync-core.yml)

Both workflows require a `PAT_TOKEN_FOR_PUSH` repo secret with write
access to the target repos. **Never edit the OpenAPI spec or Core
package directly in their mirror repos** — edit them here and let the
sync workflow propagate.
