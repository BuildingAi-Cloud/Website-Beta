"use client";

import { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Field } from "@/components/ui";
import { createTeamBuilding } from "./actions";

type Result = { ok: true } | { ok: false; error: string } | null;

export function NewBuildingForm() {
  const [state, formAction, pending] = useActionState<Result, FormData>(createTeamBuilding, null);

  useEffect(() => {
    if (state && !state.ok) toast.error("Couldn't create building", { description: state.error });
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <Field name="name" label="Building name" placeholder="123 Main Tower" required maxLength={120} />
      <Field name="address" label="Address" placeholder="123 Main St" required maxLength={200} />
      <div className="grid grid-cols-3 gap-3">
        <Field name="city" label="City" placeholder="Toronto" required maxLength={80} />
        <Field name="state" label="Province" placeholder="ON" required maxLength={40} />
        <Field name="zipCode" label="Postal code" placeholder="M5V 1A1" required maxLength={20} />
      </div>
      <Field name="timezone" label="Timezone" placeholder="America/Toronto" defaultValue="America/Toronto" maxLength={60} />

      <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Data residency</p>
        <p className="mt-1 text-sm font-medium">Canada · ca-central (Toronto)</p>
        <p className="mt-1 text-xs text-muted-foreground">All resident data stays in Canada by default.</p>
      </div>

      <AnimatePresence>
        {state && !state.ok && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-md border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-600 dark:text-red-400"
          >
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Creating…" : "Create building"}
      </button>
    </form>
  );
}
