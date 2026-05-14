import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

// Scoped to the post-login app: when the user opens the installed PWA,
// they land on /dashboard (which auth-gates to /signin if their session
// has lapsed — but inside the PWA, never the marketing site). scope is
// kept at "/" so the in-PWA sign-in flow works without bouncing out
// to the system browser.
//
// Name / colours / description are sourced from lib/brand so a
// white-label deployment can override via env vars without code edits.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard?source=pwa",
    name: brand.name,
    short_name: brand.shortName,
    description: brand.description,
    start_url: "/dashboard?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: brand.themeColor,
    theme_color: brand.themeColor,
    categories: ["productivity", "business"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
