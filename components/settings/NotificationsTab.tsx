// Notifications settings panel. R1 sends a fixed set of transactional
// emails (welcome, password reset, work-order updates that mention you,
// announcements you authored). Per-channel toggles need a new
// NotificationPreference table — that lands later. For now we surface
// what's currently sent so users aren't confused.

const CURRENT_EMAILS: { title: string; description: string }[] = [
  {
    title: "Welcome & sign-in",
    description: "Account confirmation and password-reset links via Resend.",
  },
  {
    title: "Announcements",
    description: "Notices your building team posts, scoped to your audience.",
  },
  {
    title: "Maintenance updates",
    description: "Status changes on work orders you opened.",
  },
  {
    title: "Deliveries",
    description: "When the concierge logs a package with your unit's pickup code.",
  },
];

export function NotificationsTab({ email }: { email: string }) {
  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Email channel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We currently send transactional notifications to{" "}
          <span className="font-mono text-foreground">{email}</span>. Per-event toggles land
          alongside the in-app notifications hub.
        </p>

        <ul className="mt-4 space-y-2">
          {CURRENT_EMAILS.map((item) => (
            <li
              key={item.title}
              className="flex items-start justify-between gap-4 border border-border rounded-md px-4 py-3"
            >
              <div className="min-w-0">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10">
                On
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Mobile push</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Coming with the next PWA notification permission flow. When you install the app to
          your home screen we&apos;ll prompt for permission.
        </p>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">SMS</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Not enabled in R1. Reach out to{" "}
          <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
            info@buildingsync.app
          </a>{" "}
          if your building needs SMS for emergencies.
        </p>
      </section>
    </div>
  );
}
