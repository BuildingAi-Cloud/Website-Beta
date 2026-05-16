# Installed PWA surface

What appears on the user's home screen, in the OS app switcher, and
on the splash screen during PWA launch. The first thing the user
sees every time they open the installed app.

## Surface

- iOS Safari → Share → Add to Home Screen
- Android Chrome → Install banner / menu → Install
- Desktop Chrome / Edge → URL bar install button

## Brand surfaces

| Where                            | Token                          | Source                       |
| -------------------------------- | ------------------------------ | ---------------------------- |
| Home-screen app name             | `brand.name`                   | `app/manifest.ts`            |
| Narrow-surface name (notch etc.) | `brand.shortName`              | `app/manifest.ts`            |
| App description (some installers)| `brand.description`            | `app/manifest.ts`            |
| Splash + theme colour            | `brand.themeColor`             | `app/manifest.ts` + `app/layout.tsx` |
| Home-screen icon                 | static asset                   | `public/icons/icon-512.png` etc. |
| Apple touch icon                 | static asset                   | `app/apple-icon.png`         |
| iOS status-bar style             | hardcoded `black-translucent`  | `app/layout.tsx` `appleWebApp` |
| Install prompt copy              | hardcoded English              | `components/PwaInstallPrompt.tsx` |

## Static assets to swap

- `public/icons/icon-192.png` (192×192, any-purpose)
- `public/icons/icon-512.png` (512×512, any-purpose)
- `public/icons/icon-512.png` (also referenced as the maskable icon)
- `app/apple-icon.png` (180×180, iOS)
- `app/icon.svg` (favicon source — Next.js auto-rasterises)

For maskable icons, ensure the customer logo has ≥10% safe-area
padding around the edges (W3C Maskable App Icons spec). Test in
[maskable.app](https://maskable.app).

## Override checklist

- [ ] `NEXT_PUBLIC_BRAND_NAME`
- [ ] `NEXT_PUBLIC_BRAND_SHORT_NAME`
- [ ] `NEXT_PUBLIC_BRAND_DESCRIPTION`
- [ ] `NEXT_PUBLIC_BRAND_THEME_COLOR` (used as both `theme_color`
      and `background_color` in the manifest)
- [ ] Replace `public/icons/icon-192.png`
- [ ] Replace `public/icons/icon-512.png`
- [ ] Replace `app/apple-icon.png`
- [ ] Replace `app/icon.svg` (rendered to favicon at build)

## Test checklist

- [ ] iOS Safari: Add to Home Screen → installed app shows customer
      name + icon
- [ ] Android Chrome: Install → installed app shows customer name + icon
- [ ] Splash screen colour matches `themeColor`
- [ ] Maskable icon renders cleanly in Android's adaptive shape mask
- [ ] App description appears in install dialogs (Android Chrome)
