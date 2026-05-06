"use client";

import { useActionState } from "react";
import { addResident } from "./actions";

type Result =
  | { ok: true; email: string; password: string | null; message: string }
  | { ok: false; error: string }
  | null;

export function AddResidentForm({
  units,
}: {
  units: Array<{ id: string; unitNumber: string }>;
}) {
  const [state, formAction, pending] = useActionState<Result, FormData>(addResident, null);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium mb-1.5">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="resident@example.com"
            className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Role</span>
          <select
            name="role"
            defaultValue="resident"
            className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
          >
            <option value="resident">Resident</option>
            <option value="tenant">Tenant</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Unit (optional)</span>
        <select
          name="unitId"
          defaultValue=""
          className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
        >
          <option value="">— no unit —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>Unit {u.unitNumber}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add resident"}
      </button>

      {state && state.ok === false && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {state && state.ok === true && (
        <div className="bg-accent/10 border border-accent/30 rounded-md p-4 text-sm">
          <p className="font-medium">{state.message}</p>
          {state.password && (
            <div className="mt-3 font-mono text-xs space-y-1 bg-card/60 border border-border rounded p-3">
              <div>Email: <span className="select-all">{state.email}</span></div>
              <div>Temp password: <span className="select-all">{state.password}</span></div>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Share these credentials with the resident. They can sign in at /signin and change their password later.
          </p>
        </div>
      )}
    </form>
  );
}
