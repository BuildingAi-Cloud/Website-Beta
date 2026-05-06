"use client";

import { useActionState } from "react";
import { bulkAddResidents } from "./actions";

type Result =
  | {
      ok: true;
      created: number;
      linked: number;
      rows: Array<{ row: number; email: string; password: string | null; status: "created" | "linked" }>;
      errors: Array<{ row: number; email: string; error: string }>;
    }
  | { ok: false; error: string }
  | null;

const SAMPLE = `email,role,unit
alice@example.com,resident,201
bob@example.com,tenant,202
charlie@example.com,resident,`;

export function BulkAddForm() {
  const [state, formAction, pending] = useActionState<Result, FormData>(bulkAddResidents, null);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <p className="text-xs text-muted-foreground">
        Paste CSV with columns: <code className="font-mono">email, role, unit</code>. Header row optional. Role defaults to <code className="font-mono">resident</code>; unit can be blank. Existing users are re-linked.
      </p>
      <textarea
        name="csv"
        rows={6}
        placeholder={SAMPLE}
        className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition font-mono text-xs"
      />
      <div className="flex items-center gap-3 text-xs">
        <span className="text-muted-foreground">or upload a .csv file:</span>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          className="text-xs file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-border file:bg-card file:hover:bg-muted file:transition-colors file:cursor-pointer file:text-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Onboarding…" : "Onboard batch"}
      </button>

      {state && state.ok === false && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {state && state.ok === true && (
        <div className="bg-card border border-border rounded-md p-4 text-sm space-y-3">
          <p className="font-medium">
            <span className="text-accent">{state.created} created</span>
            {" · "}
            <span className="text-muted-foreground">{state.linked} re-linked</span>
            {state.errors.length > 0 && (
              <>{" · "}<span className="text-destructive">{state.errors.length} errors</span></>
            )}
          </p>

          {state.rows.filter((r) => r.password).length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Temporary passwords (share with each resident)
              </p>
              <div className="font-mono text-xs space-y-1 bg-background/40 border border-border rounded p-3 max-h-48 overflow-y-auto">
                {state.rows
                  .filter((r) => r.password)
                  .map((r) => (
                    <div key={r.row} className="flex justify-between gap-3">
                      <span className="select-all">{r.email}</span>
                      <span className="select-all text-accent">{r.password}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {state.errors.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-2">Errors</p>
              <ul className="space-y-1 text-xs">
                {state.errors.map((e) => (
                  <li key={e.row}>
                    <span className="text-muted-foreground">Row {e.row}</span>
                    {" · "}
                    <span>{e.email || "—"}</span>
                    {" · "}
                    <span className="text-destructive">{e.error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
