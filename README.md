# BuildingSync

**The everyday app for residential buildings.**

Residents report maintenance, read building announcements, pick up
packages, book the party room, and pay rent — all in one place.
Building staff handle the same things from a single dashboard.

→ Try it at **[www.buildingsync.app](https://www.buildingsync.app)**

---

## What's in the app

| For residents and tenants                                  | For building staff                                       |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| Report a maintenance problem and track it to resolution    | One queue of every open work order in the building       |
| Get building announcements in the app + by email           | Post announcements to everyone, only tenants, or specific units |
| Pickup codes for packages waiting at the front desk        | Log packages with one tap; auto-notify the recipient     |
| Book the party room, BBQ, gym, guest suite                 | See the full booking schedule, prevent double-bookings   |
| Pay rent securely from your phone                          | Track payments, generate receipts                         |
| Find building documents — bylaws, fire plans, rules        | Upload and version-control building documents            |
| See community events and RSVP                              | Plan and post events; track who's coming                 |

Plus: works on phones, tablets, and computers — no app store
download needed. Add to your home screen for one-tap access.
Accessible by default: large-text and high-contrast modes built in.

## Who it's for

- **Residents and tenants** — sign in, see everything that matters
  about your building in one place
- **Building managers** — run the building from one screen, replace
  five other tools
- **Facility managers and concierge** — handle work orders and
  packages without paper or shared inboxes
- **Property management firms** — manage multiple buildings from
  one account

## Pricing

Free for residents. Buildings pay $2.50 per unit per month, with
the first 90 days free. Enterprise and on-premise options available
for larger portfolios and government / healthcare deployments.
See [details for property managers →](https://www.buildingsync.app/for-property-managers)

## Other ways to reach BuildingSync

- **iPhone + iPad**: a native iOS app is in development. For now
  use [www.buildingsync.app](https://www.buildingsync.app) in Safari —
  it installs as an app via Share → Add to Home Screen.
- **Android**: same — works in Chrome and installs from the menu.
- **Help**: [Help Centre](https://www.buildingsync.app/docs) ·
  [info@buildingsync.app](mailto:info@buildingsync.app)

BuildingSync is built in Canada by [Node2.io](https://www.buildingsync.app/about).

---

# Developer reference

The rest of this README is for engineers working on this repo.

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

> R&D and phased development happens in `BuildingAi-Cloud/BuildingSync-Lab`. This repo is the narrow production cut. Port forward; don't bidirectional-merge.
