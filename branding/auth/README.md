# Auth surface

Sign-in, sign-up, and password-reset flows. The first impression a
new resident or BM gets of the brand.

## Routes

- `/signin`
- `/signup`
- `/auth/callback`
- `/auth/reset`
- `/onboarding` and `/onboarding/pending`

## Brand surfaces

| Where                          | Token                          | Source                          |
| ------------------------------ | ------------------------------ | ------------------------------- |
| Top-bar wordmark               | `brand.name`                   | `components/AuthShell.tsx`      |
| Page title                     | hardcoded per `metadata`       | `app/signin/page.tsx`, `app/signup/page.tsx` |
| Footer copyright + attribution | `brand.name`, `parentAttribution`, `showPoweredBy` | `components/AuthShell.tsx` |
| "Powered by BuildingSync" line | `brand.showPoweredBy`          | `components/AuthShell.tsx`      |
| Sign-up plan caption           | hardcoded "$2.50 / unit / mo"  | `app/signup/page.tsx`           |
| Privacy / Terms links          | always link to `/privacy`, `/terms` | `components/AuthShell.tsx` |

## Static assets to swap

None unique to auth — these pages reuse the shared favicon + Apple icon.

## Override checklist

- [ ] `NEXT_PUBLIC_BRAND_NAME` (drives wordmark + footer)
- [ ] `NEXT_PUBLIC_BRAND_PARENT_ATTRIBUTION` (set to `none` to hide
      "a Node2.io service" for fully-unbranded customers)
- [ ] `NEXT_PUBLIC_BRAND_SHOW_POWERED_BY=false` for fully-unbranded
- [ ] Sweep sign-up plan copy if the customer's pricing differs
      (or remove that line for white-label deployments where pricing
      is handled outside the product)

## Test checklist

- [ ] `/signin` wordmark shows customer brand
- [ ] `/signup` shows customer brand + (if customer wants) custom plan copy
- [ ] Footer attribution: customer name + (optional) parent line
- [ ] "Powered by" line visible on co-branded, hidden on fully-unbranded
- [ ] Privacy / Terms links route to the correct legal pages
