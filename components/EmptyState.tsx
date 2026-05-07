import Link from "next/link";

// Friendly empty-state block — used on list pages when there's nothing
// to show yet. Replaces the bare "No X yet" muted-foreground text with
// something a bit more inviting.
export function EmptyState({
  title,
  description,
  cta,
  icon = "inbox",
}: {
  title: string;
  description?: string;
  cta?: { href: string; label: string } | { onClick: () => void; label: string };
  icon?: "inbox" | "users" | "megaphone" | "key" | "tools" | "package";
}) {
  return (
    <div className="bg-card border border-dashed border-border rounded-lg px-6 py-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
        <Icon name={icon} />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
      {cta && (
        <div className="mt-5">
          {"href" in cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              {cta.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={cta.onClick}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              {cta.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Icon({ name }: { name: "inbox" | "users" | "megaphone" | "key" | "tools" | "package" }) {
  const common = { className: "w-5 h-5", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };
  switch (name) {
    case "inbox":
      return (<svg {...common}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>);
    case "users":
      return (<svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "megaphone":
      return (<svg {...common}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>);
    case "key":
      return (<svg {...common}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>);
    case "tools":
      return (<svg {...common}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>);
    case "package":
      return (<svg {...common}><path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>);
  }
}
