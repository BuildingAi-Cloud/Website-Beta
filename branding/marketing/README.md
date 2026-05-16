# Marketing surface

Public pages a prospect sees before signing in.

## Routes

- `/` — landing page
- `/about`
- `/for-property-managers`
- `/enterprise` (and `/enterprise?gov=1`)
- `/walkthrough`
- `/contact`
- `/press`
- `/privacy`
- `/terms`
- `/accessibility`
- `/docs` — public Help Centre
- `/developers` — developer portal

## Brand surfaces

| Where                       | Token                          | Source                           |
| --------------------------- | ------------------------------ | -------------------------------- |
| Wordmark in every header    | `brand.name`                   | `components/ui` `<Wordmark/>`    |
| `<title>` per page          | hardcoded per `metadata`       | `app/<page>/page.tsx`            |
| Footer copyright            | `brand.name` + `parentAttribution` | `components/AuthShell.tsx`   |
| OG / Twitter card image     | static asset                   | `public/og-image.png`            |
| Favicon                     | static asset                   | `app/icon.svg`, `app/apple-icon.png` |
| Display font                | hardcoded — Bebas Neue         | `app/layout.tsx`                 |

## Static assets to swap

- `public/og-image.png` — 1200×630 social-share card
- `app/icon.svg` — favicon (rendered to PNG by Next at build)
- `app/apple-icon.png` — iOS touch icon

## Override checklist

- [ ] `NEXT_PUBLIC_BRAND_NAME`
- [ ] `NEXT_PUBLIC_BRAND_DESCRIPTION`
- [ ] `NEXT_PUBLIC_BRAND_HOST`
- [ ] `NEXT_PUBLIC_BRAND_THEME_COLOR`
- [ ] Replace `public/og-image.png` with customer's social card
- [ ] Replace `app/icon.svg` + `app/apple-icon.png`
- [ ] Per-page `metadata.title` strings still hardcode "BuildingSync" — sweep [`app/**/page.tsx`](../../app/) if the customer wants their name in the browser tab

## Test checklist

- [ ] Landing-page wordmark shows the new name
- [ ] Browser tab title reflects the customer name
- [ ] OG card preview (LinkedIn / Slack / Twitter) shows the customer asset
- [ ] Footer copyright reads `© YYYY <customer>`
- [ ] Favicon + Apple touch icon updated
