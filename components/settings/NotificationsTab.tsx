"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { saveNotificationPreferences } from "@/lib/settings-actions";
import { PushPermissionToggle } from "./PushPermissionToggle";

// Per-channel notification preferences. Email + In-app are honored
// today (Resend is wired); SMS toggle is recorded but no provider is
// hooked up yet — we keep the toggle so the UI is ready when SMS lands.

type Channel = {
  key: "email" | "sms" | "in_app";
  label: string;
  hint: string;
  available: boolean;
};

const CHANNELS: Channel[] = [
  {
    key: "email",
    label: "Email notifications",
    hint: "Announcements, work-order updates, deliveries — sent via Resend.",
    available: true,
  },
  {
    key: "sms",
    label: "SMS notifications",
    hint: "Reserved for emergencies. SMS provider lands in a future release.",
    available: false,
  },
  {
    key: "in_app",
    label: "In-app notifications",
    hint: "Surfaces in the bell menu while you're using BuildingSync.",
    available: true,
  },
];

export function NotificationsTab({
  email,
  initial,
  vapidPublicKey,
}: {
  email: string;
  initial: { email: boolean; sms: boolean; inApp: boolean };
  vapidPublicKey: string | null;
}) {
  const [prefs, setPrefs] = useState(initial);
  const [pending, startTransition] = useTransition();

  function toggle(key: Channel["key"]) {
    setPrefs((prev) => {
      if (key === "email") return { ...prev, email: !prev.email };
      if (key === "sms") return { ...prev, sms: !prev.sms };
      return { ...prev, inApp: !prev.inApp };
    });
  }

  function save() {
    const fd = new FormData();
    fd.set("email", prefs.email ? "1" : "0");
    fd.set("sms", prefs.sms ? "1" : "0");
    fd.set("inApp", prefs.inApp ? "1" : "0");
    startTransition(async () => {
      const res = await saveNotificationPreferences(fd);
      if (res.ok) toast.success("Preferences saved");
      else toast.error("Couldn't save", { description: res.error });
    });
  }

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Notification preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We send transactional notifications to{" "}
          <span className="font-mono text-foreground">{email}</span>. Toggle channels below.
        </p>

        <ul className="mt-4 space-y-2">
          {CHANNELS.map((channel) => {
            const checked =
              channel.key === "email" ? prefs.email :
              channel.key === "sms" ? prefs.sms :
              prefs.inApp;
            return (
              <li key={channel.key} className="border border-border rounded-md px-4 py-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(channel.key)}
                    className="mt-0.5 w-5 h-5 rounded accent-accent shrink-0 cursor-pointer"
                    aria-label={channel.label}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{channel.label}</span>
                      {!channel.available && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10">
                          Provider pending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{channel.hint}</div>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="mt-5">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="px-5 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {pending ? "Saving…" : "Save notifications"}
          </button>
        </div>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Mobile + desktop push</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Get notifications even when BuildingSync isn&apos;t open. iOS requires the PWA to be
          installed to your home screen first.
        </p>
        <div className="mt-4">
          <PushPermissionToggle vapidPublicKey={vapidPublicKey} />
        </div>
      </section>
    </div>
  );
}
