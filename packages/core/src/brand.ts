// Brand-adaptation primitive. A single source of truth for per-deployment
// brand tokens so a white-label customer can swap name, colours, contact,
// and attribution without code edits — set the env vars below, redeploy.
//
// Default values keep the canonical BuildingSync identity for the main
// deployment. Customer deployments override what they need.
//
// Lives in @buildingsync/core because both the cloud app and the on-prem
// app read these same env vars and expect the same shape.

type Brand = {
  /** Display name shown across the app (manifest, footer, page titles). */
  name: string;
  /** Short variant for narrow surfaces (mobile manifest, tab title). */
  shortName: string;
  /** Tagline for the PWA manifest description. */
  description: string;
  /** Primary support email — used in empty states, error pages, footer. */
  supportEmail: string;
  /** Marketing site host (no protocol). Used for absolute URLs. */
  host: string;
  /** PWA theme + background colour (CSS hex). */
  themeColor: string;
  /** "Powered by BuildingSync" attribution in the footer. */
  showPoweredBy: boolean;
  /** Parent company line for the footer ("a Node2.io service"). */
  parentAttribution: string | null;
};

const DEFAULTS: Brand = {
  name: "BuildingSync",
  shortName: "BuildingSync",
  description: "Property management for residents, tenants, and staff.",
  supportEmail: "info@buildingsync.app",
  host: "www.buildingsync.app",
  themeColor: "#141414",
  showPoweredBy: true,
  parentAttribution: "a Node2.io service",
};

function envBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  const v = value.trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return fallback;
}

function envNullable(value: string | undefined, fallback: string | null): string | null {
  if (value === undefined) return fallback;
  const v = value.trim();
  if (v === "" || v.toLowerCase() === "none") return null;
  return v;
}

// Resolved once at module load. Read NEXT_PUBLIC_* so client components
// inherit the same values without a separate API call.
export const brand: Brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || DEFAULTS.name,
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME?.trim() || DEFAULTS.shortName,
  description: process.env.NEXT_PUBLIC_BRAND_DESCRIPTION?.trim() || DEFAULTS.description,
  supportEmail: process.env.NEXT_PUBLIC_BRAND_SUPPORT_EMAIL?.trim() || DEFAULTS.supportEmail,
  host: process.env.NEXT_PUBLIC_BRAND_HOST?.trim() || DEFAULTS.host,
  themeColor: process.env.NEXT_PUBLIC_BRAND_THEME_COLOR?.trim() || DEFAULTS.themeColor,
  showPoweredBy: envBool(process.env.NEXT_PUBLIC_BRAND_SHOW_POWERED_BY, DEFAULTS.showPoweredBy),
  parentAttribution: envNullable(process.env.NEXT_PUBLIC_BRAND_PARENT_ATTRIBUTION, DEFAULTS.parentAttribution),
};

/** True when running under the canonical BuildingSync identity. */
export const isCanonicalBrand = brand.name === DEFAULTS.name;
