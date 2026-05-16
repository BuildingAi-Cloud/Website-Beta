# Resident portal surface

Where residents and tenants spend their day. Highest white-label
visibility — every brand element here lives in front of the end-user
many times per week.

## Routes

- `/dashboard`
- `/dashboard/maintenance`
- `/dashboard/announcements`
- `/dashboard/amenities`
- `/dashboard/events`
- `/dashboard/deliveries`
- `/dashboard/documents`
- `/dashboard/payments`
- `/dashboard/posts`
- `/dashboard/contacts`
- `/dashboard/menu` (mobile)
- `/dashboard/account`
- `/dashboard/settings`

## Brand surfaces

| Where                                  | Token                          | Source                          |
| -------------------------------------- | ------------------------------ | ------------------------------- |
| Desktop header wordmark + portal label | `brand.name`                   | `components/ResidentShell.tsx`  |
| Dashboard hero greeting                | `brand.name` (when no building) | `app/dashboard/page.tsx`       |
| Welcome empty-state copy               | hardcoded "BuildingSync"       | `app/dashboard/page.tsx` (line "Welcome to BuildingSync") |
| Mobile bottom-tab labels               | hardcoded English              | `components/MobileTabBar.tsx`   |
| Account-menu identity card             | user name + role               | `components/AccountMenu.tsx`    |

## Static assets to swap

- PWA icons (cover via `pwa/` page-type — same files).

## Override checklist

- [ ] `NEXT_PUBLIC_BRAND_NAME` (drives header wordmark + greeting fallback)
- [ ] `NEXT_PUBLIC_BRAND_SHORT_NAME` (mobile-narrow surfaces)
- [ ] Sweep `app/dashboard/page.tsx` for the literal "BuildingSync"
      string in the no-building empty state — currently hardcoded
- [ ] Confirm theme colour matches the dark hero background
      (`brand.themeColor` defaults to `#141414`)

## Test checklist

- [ ] Desktop header wordmark = customer brand
- [ ] Dashboard with a linked building → building name in hero
      (no BuildingSync mark)
- [ ] Dashboard with NO linked building → fallback shows customer
      brand, not "BuildingSync"
- [ ] Mobile hero (dark band) renders correctly with new theme colour
- [ ] Notification bell + account avatar reachable on mobile
- [ ] PWA install prompt shows customer name (cross-check with `pwa/`)
