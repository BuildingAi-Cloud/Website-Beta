"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { rotateBuildingInviteCode } from "./actions";

export function InviteCodePanel({
  initialCode,
  initialUpdatedAt,
  signupBaseUrl,
}: {
  initialCode: string | null;
  initialUpdatedAt: Date | null;
  signupBaseUrl: string;
}) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(initialUpdatedAt);
  const [pending, startTransition] = useTransition();

  function rotate() {
    startTransition(async () => {
      const res = await rotateBuildingInviteCode();
      if (res.ok) {
        setCode(res.code);
        setUpdatedAt(new Date());
        toast.success("New invite code issued", {
          description: "Old codes no longer work.",
        });
      } else {
        toast.error("Couldn't rotate code", { description: res.error });
      }
    });
  }

  function copy(text: string, label: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied`))
      .catch(() => toast.error("Copy failed"));
  }

  const link = code ? `${signupBaseUrl}/signup?code=${code}` : null;

  return (
    <section>
      <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
        Self-signup invite code
      </h2>
      <div className="bg-card border border-border rounded-md p-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Share this code or link with new residents — they enter it during signup and are
          auto-linked to your building. Rotate it to invalidate old codes.
        </p>

        {code ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl md:text-4xl font-mono font-semibold tracking-widest tabular-nums">
                {code}
              </span>
              <button
                type="button"
                onClick={() => copy(code, "Code")}
                className="px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs transition-colors"
              >
                Copy code
              </button>
              {link && (
                <button
                  type="button"
                  onClick={() => copy(link, "Signup link")}
                  className="px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs transition-colors"
                >
                  Copy signup link
                </button>
              )}
            </div>
            {updatedAt && (
              <p className="text-xs text-muted-foreground">
                Issued {new Date(updatedAt).toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No code yet. Generate one to enable self-signup.
          </p>
        )}

        <div>
          <button
            type="button"
            onClick={rotate}
            disabled={pending}
            className="px-4 py-2 sm:px-3 sm:py-1.5 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? "Rotating…" : code ? "Rotate code" : "Generate code"}
          </button>
        </div>
      </div>
    </section>
  );
}
