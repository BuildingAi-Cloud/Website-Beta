import Script from "next/script";

// Plausible analytics — lightweight, cookieless, GDPR/PIPEDA-friendly.
// Loaded only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set so dev / preview
// builds don't ping Plausible. Hosted variant by default; for self-host
// or proxy, set NEXT_PUBLIC_PLAUSIBLE_SRC to override the script URL.

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
  return (
    <Script
      src={src}
      data-domain={domain}
      strategy="afterInteractive"
      defer
    />
  );
}
