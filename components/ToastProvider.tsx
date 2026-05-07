"use client";

import { Toaster } from "sonner";

// Branded sonner mount. Uses our accent color for success, our existing
// red-500 for errors, and respects the user's theme since sonner reads
// the document's color-scheme.
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "bg-card border border-border text-foreground",
          title: "font-semibold text-sm",
          description: "text-xs text-muted-foreground",
          actionButton: "bg-accent text-accent-foreground",
        },
      }}
    />
  );
}
