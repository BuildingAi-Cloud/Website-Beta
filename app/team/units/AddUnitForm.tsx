"use client";

import { useActionState } from "react";
import { addUnit } from "./actions";

type Result =
  | { ok: true; unitNumber: string }
  | { ok: false; error: string }
  | null;

export function AddUnitForm() {
  const [state, formAction, pending] = useActionState<Result, FormData>(addUnit, null);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Unit number</span>
          <input
            name="unitNumber"
            required
            maxLength={20}
            placeholder="201"
            className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Floor</span>
          <input
            name="floor"
            type="number"
            min={0}
            max={200}
            placeholder="2"
            className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Rent (USD/mo)</span>
          <input
            name="rentAmount"
            type="number"
            step="0.01"
            min={0}
            placeholder="1500"
            className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add unit"}
      </button>

      {state && state.ok === false && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {state && state.ok === true && (
        <p className="text-sm text-accent">Unit {state.unitNumber} created.</p>
      )}
    </form>
  );
}
