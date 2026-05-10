"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { markNoticeServed, withdrawNotice } from "../actions";

export function NoticeActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [showServe, setShowServe] = useState(false);
  const todayLocal = new Date().toISOString().slice(0, 10);

  function onServe(formData: FormData) {
    startTransition(async () => {
      const res = await markNoticeServed(formData);
      if (res && res.ok === false) {
        toast.error("Couldn't mark served", { description: res.error });
      } else {
        toast.success("Notice marked served");
        setShowServe(false);
      }
    });
  }

  function onWithdraw(formData: FormData) {
    startTransition(async () => {
      const res = await withdrawNotice(formData);
      if (res && res.ok === false) {
        toast.error("Couldn't update", { description: res.error });
      } else {
        toast.success(status === "draft" ? "Withdrawn" : "Marked resolved");
      }
    });
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="px-4 py-2 sm:px-3 sm:py-1.5 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Print / save as PDF
      </button>

      {status === "draft" && !showServe && (
        <button
          type="button"
          onClick={() => setShowServe(true)}
          className="px-4 py-2 sm:px-3 sm:py-1.5 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          Mark as served
        </button>
      )}

      {status === "draft" && showServe && (
        <form action={onServe} className="bg-card border border-border rounded-md p-3 flex flex-wrap items-end gap-2 w-full">
          <input type="hidden" name="id" value={id} />
          <div>
            <label htmlFor="servedAt" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
              Service date
            </label>
            <input
              id="servedAt"
              name="servedAt"
              type="date"
              required
              defaultValue={todayLocal}
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label htmlFor="method" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
              Method
            </label>
            <select
              id="method"
              name="method"
              defaultValue="in_person"
              className="px-3 py-2 rounded-md border border-border bg-background text-sm"
            >
              <option value="in_person">In person</option>
              <option value="mail">Mail</option>
              <option value="email">Email</option>
              <option value="door">Posted on door</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-60 transition-colors"
          >
            {pending ? "Saving…" : "Confirm served"}
          </button>
          <button
            type="button"
            onClick={() => setShowServe(false)}
            className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      {(status === "draft" || status === "served") && !showServe && (
        <form action={onWithdraw}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 sm:px-3 sm:py-1.5 rounded-md border border-border text-sm hover:bg-muted disabled:opacity-60 transition-colors"
          >
            {status === "draft" ? "Withdraw draft" : "Mark resolved"}
          </button>
        </form>
      )}
    </div>
  );
}
