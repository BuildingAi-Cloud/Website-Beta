"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { validateLicenseKey, sendLicenseHeartbeat } from "./actions";

export function LicenseForm({ hasLicense }: { hasLicense: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [hbPending, startHeartbeat] = useTransition();

  function onValidate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await validateLicenseKey(formData);
      if (res && res.ok === false) {
        setError(res.error);
        toast.error("Validation failed", { description: res.error });
      }
      // Success branch redirects server-side.
    });
  }

  function onHeartbeat() {
    startHeartbeat(async () => {
      const res = await sendLicenseHeartbeat();
      if (res.ok) toast.success("Heartbeat sent");
      else toast.error("Couldn't send heartbeat", { description: res.error });
    });
  }

  return (
    <form action={onValidate} className="mt-4 space-y-4">
      <textarea
        name="key"
        rows={4}
        placeholder="Paste signed license key (payload.signature)"
        spellCheck={false}
        className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-xs resize-y"
      />

      {error && (
        <p className="text-sm text-rose-700 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {pending ? "Validating…" : "Validate key"}
        </button>
        <button
          type="button"
          onClick={onHeartbeat}
          disabled={!hasLicense || hbPending}
          className="px-4 py-2 rounded-md border border-border hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {hbPending ? "Sending…" : "Send heartbeat"}
        </button>
      </div>
    </form>
  );
}
