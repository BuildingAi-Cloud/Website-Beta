"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { requestAccountDeletion } from "@/lib/settings-actions";

// Account-deletion request button. Two-step confirmation so a stray
// click can't archive your account. Server action signs the user out
// after archiving and redirects to "/?archived=1".

export function PrivacyActions({ archived }: { archived: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (archived) {
    return (
      <div className="px-4 py-2 rounded-md border border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10 text-sm">
        Your account is pending deletion.
      </div>
    );
  }

  function confirmDelete() {
    startTransition(async () => {
      const res = await requestAccountDeletion();
      if (res && res.ok === false) {
        toast.error("Couldn't delete account", { description: res.error });
        setConfirming(false);
      }
      // Success branch redirects server-side, so nothing to do here.
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-rose-500/40 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-semibold"
      >
        Request deletion
      </button>
    );
  }

  return (
    <div className="bg-rose-500/5 border border-rose-500/30 rounded-md p-4 space-y-3">
      <p className="text-sm">
        <span className="font-semibold text-rose-700 dark:text-rose-400">Are you sure?</span>{" "}
        Your account will be archived immediately and you&apos;ll be signed out. Records are kept
        for the retention window before being purged.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={confirmDelete}
          disabled={pending}
          className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors text-sm"
        >
          {pending ? "Archiving…" : "Yes, archive my account"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
