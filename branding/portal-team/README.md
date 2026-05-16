# Team portal surface

Building Manager / Facility Manager / concierge admin. Internal-
facing, but still visible to staff every day.

## Routes

- `/team` (home + dashboard)
- `/team/work-orders`
- `/team/incidents`
- `/team/packages`
- `/team/residents`
- `/team/staff`
- `/team/units`
- `/team/announcements`
- `/team/documents`
- `/team/legal`
- `/team/access-requests`
- `/team/audit-log`
- `/team/license`
- `/team/settings`
- `/team/account`

## Brand surfaces

| Where                            | Token                          | Source                       |
| -------------------------------- | ------------------------------ | ---------------------------- |
| Top-bar wordmark + "TEAM" chip   | `brand.name`                   | `components/PortalShell.tsx` |
| L1 + L2 pill nav                 | section labels (English)       | `components/PortalNav.tsx`   |
| Account menu                     | user name + role               | `components/AccountMenu.tsx` |
| Page H1s                         | hardcoded English              | each `app/team/<route>/page.tsx` |
| License page surface             | hardcoded "BuildingSync" copy  | `app/team/license/page.tsx`  |
| Welcome email (when adding staff)| `welcomeEmail()` template      | `lib/email.ts`               |

## Static assets to swap

None unique to team — shares marketing favicon + Apple icon.

## Override checklist

- [ ] `NEXT_PUBLIC_BRAND_NAME`
- [ ] Sweep `app/team/license/page.tsx` for hardcoded brand strings
      (license metadata frames things as "BuildingSync license")
- [ ] Sweep `app/team/legal/page.tsx` for province / jurisdiction
      assumptions if the customer operates outside Ontario

## Test checklist

- [ ] Header wordmark + "TEAM" chip render with customer brand
- [ ] L1 pill nav (`OPERATIONS · PEOPLE · PROPERTY · COMPLIANCE`)
      renders, scrolls horizontally on narrow viewports
- [ ] L2 pill nav appears under the active L1
- [ ] Position breadcrumb (`OPERATIONS · 2 / 3`) renders correctly
- [ ] Add-resident flow → welcome email shows customer "from" name
      (set via `RESEND_FROM_EMAIL`)
- [ ] License page reads correctly under customer brand
