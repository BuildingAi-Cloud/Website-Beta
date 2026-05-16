# Email surface

Transactional email is the most-frequent customer-facing brand
touch outside the app itself. R1 has the "from" name + footer
parameterised; the body copy still hardcodes "BuildingSync" in
several templates.

## Templates

All in [`lib/email.ts`](../../lib/email.ts):

- `welcomeEmail` — new account, includes temp password
- `workOrderCreatedEmail` — sent to BM/FM on resident submit
- `workOrderStatusChangedEmail` — sent to opener when staff updates
- `announcementBroadcastEmail` — sent to recipients of an announcement

## Brand surfaces

| Where                            | Token                                | Source                       |
| -------------------------------- | ------------------------------------ | ---------------------------- |
| "From" name + email              | `RESEND_FROM_EMAIL` env var          | `lib/email.ts` line 4        |
| Sender domain                    | configured in Resend dashboard       | resend.com                   |
| Footer "Sent by ..." line        | `brand.name` + `brand.parentAttribution` | `lib/email.ts` `wrap()` |
| Footer Privacy / Terms links     | `APP_BASE_URL` env var               | `lib/email.ts` line 5        |
| Footer support email             | `brand.supportEmail`                 | `lib/email.ts` `wrap()`      |
| Welcome email H1 + subject + text| `brand.name`                         | `lib/email.ts` `welcomeEmail` |
| "View in ..." CTA                | `brand.name`                         | `workOrderCreatedEmail`      |
| CTA button colour                | hardcoded `#141414`                  | `lib/email.ts` (all templates) |
| Card cream + off-white palette   | hardcoded warmth-tones               | `lib/email.ts` `wrap()`      |
| CASL §6 footer                   | required for Canada — keep           | `lib/email.ts` `wrap()`      |

## Override checklist

- [x] `RESEND_FROM_EMAIL` — set to customer's verified domain
- [x] `APP_BASE_URL` — drives footer Privacy/Terms links
- [x] `NEXT_PUBLIC_BRAND_NAME` — drives body H1s, subjects, "View in"
      CTAs, and the "Sent by" footer line
- [x] `NEXT_PUBLIC_BRAND_SUPPORT_EMAIL` — drives the footer mailto link
- [x] `NEXT_PUBLIC_BRAND_PARENT_ATTRIBUTION` — set to `none` to drop
      the "a Node2.io service" line in the footer
- [ ] **R2 nice-to-have**: parameterise the CTA button colour
      (currently hardcoded `#141414` — fine for most brands, but
      customers with a coloured CTA brand identity may want to swap)
- [ ] **R2 nice-to-have**: parameterise the email card palette
      (cream / off-white) for customers whose brand is darker

For Co-branded **and** Fully Unbranded tiers today, body copy and
attribution flow from `lib/brand.ts` — no source edits required.

## DNS + deliverability

Customer must:

1. Add the customer's sending domain in Resend.
2. Verify SPF, DKIM, DMARC records.
3. Confirm `RESEND_FROM_EMAIL` uses the verified domain.
4. (Optional) Set up a custom return-path subdomain for bounce
   handling.

## Test checklist

- [ ] Trigger a welcome email — "from" address shows customer domain
- [ ] Footer Privacy / Terms links point at the customer host
- [ ] Footer support email is correct (or the body is swept for R2)
- [ ] Email passes SPF + DKIM (check via mail-tester.com)
- [ ] CASL §6 footer remains intact (Canadian customers)
- [ ] Welcome email arrives in inbox, not spam
