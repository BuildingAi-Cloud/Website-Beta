import Link from "next/link";

// Accessibility centre. Surfaces the things we already do (high
// contrast Paper/Light/Dark themes, reduced-motion respected, AA
// contrast pass) and the path to report issues. AODA / WCAG-aligned
// — Canada-targeted launch needs this discoverable.

export default function AccessibilityPage() {
  return (
    <main className="px-4 md:px-6 py-12 max-w-2xl mx-auto">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13l-5-2v-3a2 2 0 0 0-4 0v3l-5 2" />
          <path d="M9 22l3-8 3 8" />
          <path d="M9 14h6" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-center">Accessibility</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-center">
        BuildingSync targets WCAG 2.1 AA and AODA-compliant UX. Here&apos;s where we are today.
      </p>

      <ul className="mt-8 space-y-2 text-sm">
        <li className="bg-card border border-border rounded-md p-4">
          <span className="font-semibold">Three contrast modes.</span>{" "}
          <span className="text-muted-foreground">Paper, Light, Dark — toggle from the header. All meet AA contrast ratios.</span>
        </li>
        <li className="bg-card border border-border rounded-md p-4">
          <span className="font-semibold">Reduced-motion respected.</span>{" "}
          <span className="text-muted-foreground">Animations are disabled when your OS reports <code className="font-mono text-xs">prefers-reduced-motion</code>.</span>
        </li>
        <li className="bg-card border border-border rounded-md p-4">
          <span className="font-semibold">Keyboard navigable.</span>{" "}
          <span className="text-muted-foreground">All actions are reachable without a mouse. Focus rings are visible across themes.</span>
        </li>
        <li className="bg-card border border-border rounded-md p-4">
          <span className="font-semibold">Screen-reader labels.</span>{" "}
          <span className="text-muted-foreground">Icon buttons carry <code className="font-mono text-xs">aria-label</code>; status updates use live regions.</span>
        </li>
      </ul>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Hit a barrier? Email{" "}
        <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">info@buildingsync.app</a>{" "}
        and we&apos;ll fix it.
      </p>
      <div className="mt-6 text-center">
        <Link
          href="/team"
          className="inline-flex px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm"
        >
          Back
        </Link>
      </div>
    </main>
  );
}
