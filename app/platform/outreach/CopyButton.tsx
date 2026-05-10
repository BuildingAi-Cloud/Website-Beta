"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard API can fail in non-secure contexts; user can fallback to
        // selecting + cmd-C on the rendered text.
      });
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-muted transition-colors"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
