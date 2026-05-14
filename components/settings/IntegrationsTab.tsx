"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { requestIntegrationAccess } from "@/components/settings/integrations-actions";

// Placeholder integrations gallery. Each card captures a "request
// access" signal — we don't ship any of these in R1, but a paying
// customer asking for them is the cheapest possible product-research
// loop. The action logs to AuditLog + emails info@buildingsync.app.

type Integration = {
  key: string;
  name: string;
  category: "Messaging" | "Workflow" | "Developer";
  description: string;
  icon: React.ReactNode;
};

const INTEGRATIONS: Integration[] = [
  {
    key: "slack",
    name: "Slack",
    category: "Messaging",
    description:
      "Pipe work orders, incidents, and announcements into a Slack channel. Reply in-thread to update status.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M5.5 14.5a2.5 2.5 0 1 0 0-5h-2.5v2.5a2.5 2.5 0 0 0 2.5 2.5zm1.25 0a2.5 2.5 0 0 1 5 0v6.25a2.5 2.5 0 0 1-5 0v-6.25zm2.5-11a2.5 2.5 0 1 0 5 0v-2.5h-2.5a2.5 2.5 0 0 0-2.5 2.5zm0 1.25a2.5 2.5 0 0 1 0 5h-6.25a2.5 2.5 0 0 1 0-5h6.25zm11 2.5a2.5 2.5 0 1 0 0 5h2.5v-2.5a2.5 2.5 0 0 0-2.5-2.5zm-1.25 0a2.5 2.5 0 0 1-5 0v-6.25a2.5 2.5 0 0 1 5 0v6.25zm-2.5 11a2.5 2.5 0 1 0-5 0v2.5h2.5a2.5 2.5 0 0 0 2.5-2.5zm0-1.25a2.5 2.5 0 0 1 0-5h6.25a2.5 2.5 0 0 1 0 5h-6.25z" />
      </svg>
    ),
  },
  {
    key: "teams",
    name: "Microsoft Teams",
    category: "Messaging",
    description:
      "Same alerts as Slack, into a Teams channel. Useful when your building staff already live in M365.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M3 6h11v12H3z" />
        <circle cx="18" cy="9" r="3" />
        <path d="M14 13h7v4a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-4z" />
      </svg>
    ),
  },
  {
    key: "email-to-ticket",
    name: "Email-to-ticket",
    category: "Workflow",
    description:
      "Forward an email to a dedicated inbox and we auto-create a work order, tagged to the right unit.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    key: "calendar",
    name: "Calendar sync",
    category: "Workflow",
    description:
      "Two-way sync of amenity bookings, inspections, and scheduled maintenance with Google or Outlook calendars.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
      </svg>
    ),
  },
  {
    key: "webhooks",
    name: "Webhooks",
    category: "Developer",
    description:
      "Subscribe to events (work_order.created, incident.opened, lease.signed) and POST them to your own endpoint.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <path d="M18 12.87V6a4 4 0 0 0-8 0v6.87" />
        <circle cx="14" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <path d="M11 18h-5" />
      </svg>
    ),
  },
  {
    key: "rest-api",
    name: "REST API",
    category: "Developer",
    description:
      "Full programmatic access with bearer-token auth. Read units, residents, work orders, post announcements.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

export function IntegrationsTab() {
  const [pending, startTransition] = useTransition();

  function onRequest(integration: Integration) {
    startTransition(async () => {
      const res = await requestIntegrationAccess(integration.key);
      if (res.ok) {
        toast.success(`Request sent for ${integration.name}`, {
          description: "We'll be in touch when it's available for your building.",
        });
      } else {
        toast.error("Couldn't send your request", {
          description: res.error ?? "Try again, or email info@buildingsync.app.",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Integrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          None of these ship in R1 — pilot customers help us decide the order. Request access
          and we&apos;ll bring it forward in the roadmap.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        {INTEGRATIONS.map((it) => (
          <div
            key={it.key}
            className="bg-card border border-border rounded-md p-5 flex flex-col"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-muted/40 border border-border flex items-center justify-center text-foreground shrink-0">
                {it.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold truncate">{it.name}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm">
                    {it.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {it.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Coming soon
              </span>
              <button
                type="button"
                onClick={() => onRequest(it)}
                disabled={pending}
                className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Sending..." : "Request access"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Need something not listed? Email{" "}
        <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
          info@buildingsync.app
        </a>{" "}
        and we&apos;ll add it to this list.
      </p>
    </div>
  );
}
