# Platform admin surface

BuildingSync's own internal admin (verifies BMs, manages
buildings + users globally). For most white-label deployments
this surface is **operated by BuildingSync, not the customer** —
even when the resident + team surfaces are white-labelled.

## Routes

- `/platform`
- `/platform/buildings`
- `/platform/users`
- `/platform/verifications`
- `/platform/audit-log`
- `/platform/outreach`
- `/platform/pilot-onboarding`
- `/platform/account`
- `/platform/settings`

Hosted at `admin.buildingsync.app` per [`proxy.ts`](../../proxy.ts).

## Brand surfaces

| Where                            | Token                          | Source                       |
| -------------------------------- | ------------------------------ | ---------------------------- |
| Top-bar wordmark + "ADMIN" chip  | `brand.name`                   | `components/PortalShell.tsx` |
| Page H1s                         | hardcoded English              | each `app/platform/<route>/page.tsx` |

## Override checklist

For most deployments: **leave alone**. The admin host is BuildingSync's
own ops surface. White-label customers don't see it.

For a Sovereign / fully-isolated deployment where the customer takes
ownership of admin too:

- [ ] `NEXT_PUBLIC_BRAND_NAME`
- [ ] Update `ADMIN_HOST` env var to point at the customer's admin domain
- [ ] Confirm `proxy.ts` rewrite continues to fire on the new host

## Test checklist

(Skip unless customer owns admin.)

- [ ] Visit customer's admin host, confirm the rewrite to `/platform/*`
- [ ] Wordmark shows customer brand
- [ ] BM verification queue loads
- [ ] Buildings list loads
