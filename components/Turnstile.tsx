"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile widget. Invisible 99% of the time for real
// users; produces a token that we forward to Supabase Auth's native
// CAPTCHA support. Disabled when NEXT_PUBLIC_TURNSTILE_SITE_KEY is
// not set so dev / preview builds don't error.
//
// Supabase verifies the token server-side using the secret stored
// in the Supabase dashboard (Auth → Settings → Bot and Abuse
// Protection). Nothing to verify on our side.

declare global {
  interface Window {
    turnstile?: {
      render(
        container: string | HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible" | "flexible";
          appearance?: "always" | "execute" | "interaction-only";
        },
      ): string;
      reset(widgetId?: string): void;
      remove(widgetId?: string): void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
const SCRIPT_ID = "cf-turnstile-script";

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export function Turnstile({
  onToken,
  onError,
  className = "",
}: {
  onToken: (token: string) => void;
  onError?: () => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!sitekey || !containerRef.current) return;

    function render() {
      if (!window.turnstile || !containerRef.current || !sitekey) return;
      // Avoid double-render on hot-reload / re-mount.
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        callback: (token) => onToken(token),
        "error-callback": () => onError?.(),
        "expired-callback": () => {
          widgetIdRef.current && window.turnstile?.reset(widgetIdRef.current);
        },
        theme: "auto",
        appearance: "interaction-only",
      });
    }

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      window.onloadTurnstileCallback = render;
      document.head.appendChild(script);
    } else {
      // Script tag exists but window.turnstile not ready yet — chain.
      const prev = window.onloadTurnstileCallback;
      window.onloadTurnstileCallback = () => {
        prev?.();
        render();
      };
    }

    return () => {
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // Best-effort cleanup; widget may have been removed already.
        }
      }
      widgetIdRef.current = null;
    };
  }, [sitekey, onToken, onError]);

  if (!sitekey) return null;
  return <div ref={containerRef} className={className} />;
}
