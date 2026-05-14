"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Renders Stoplight Elements (a self-contained API reference UI) from a
// CDN so we avoid pulling a megabyte of UI into the bundle. The script
// registers a custom element <elements-api> that fetches our OpenAPI
// spec and renders interactive docs inside it.

const STYLES_HREF = "https://unpkg.com/@stoplight/elements/styles.min.css";
const SCRIPT_SRC = "https://unpkg.com/@stoplight/elements/web-components.min.js";

export function DeveloperApiExplorer() {
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    // Inject the stylesheet exactly once; Next's <Script> handles the JS.
    if (document.querySelector(`link[href="${STYLES_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLES_HREF;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      {!scriptReady && (
        <div className="p-8 text-sm text-muted-foreground text-center">
          Loading interactive API reference&hellip;
        </div>
      )}
      {/* The custom element ignores standard React types — render it via
          dangerouslySetInnerHTML once the script has registered it. */}
      {scriptReady && (
        <div
          className="elements-host"
          style={{ minHeight: "600px" }}
          dangerouslySetInnerHTML={{
            __html:
              '<elements-api apiDescriptionUrl="/api/openapi" router="hash" layout="stacked" hideSchemas="true"></elements-api>',
          }}
        />
      )}
    </div>
  );
}
