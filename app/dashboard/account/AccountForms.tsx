"use client";

import { useActionState } from "react";
import { updateProfile, updatePassword } from "./actions";

type Result = { ok: true; message: string } | { ok: false; error: string } | null;

export function ProfileForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string | null;
  defaultPhone: string | null;
}) {
  const [state, formAction, pending] = useActionState<Result, FormData>(updateProfile, null);

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Display name</span>
        <input
          name="name"
          defaultValue={defaultName ?? ""}
          maxLength={100}
          placeholder="Your name"
          className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Phone</span>
        <input
          name="phone"
          defaultValue={defaultPhone ?? ""}
          maxLength={40}
          placeholder="+1 555 555 5555"
          className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
      {state && state.ok === false && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state && state.ok === true && <p className="text-sm text-accent">{state.message}</p>}
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState<Result, FormData>(updatePassword, null);

  return (
    <form action={formAction} className="space-y-3">
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">New password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="w-full px-3 py-2 rounded-md border border-border bg-input/30 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
        />
        <span className="block mt-1 text-xs text-muted-foreground">8 characters or more.</span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
      {state && state.ok === false && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state && state.ok === true && <p className="text-sm text-accent">{state.message}</p>}
    </form>
  );
}
