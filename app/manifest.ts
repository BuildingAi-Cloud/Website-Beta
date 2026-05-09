import type { MetadataRoute } from "next";

// Scoped to the post-login app: when the user opens the installed PWA,
// they land on /dashboard (which auth-gates to /signin if their session
// has lapsed — but inside the PWA, never the marketing site). scope is
// kept at "/" so the in-PWA sign-in flow works without bouncing out
// to the system browser.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/dashboard?source=pwa",
    name: "BuildingSync",
    short_name: "BuildingSync",
    description: "Property management for residents, tenants, and staff.",
    start_url: "/dashboard?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#141414",
    theme_color: "#141414",
    categories: ["productivity", "business"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
