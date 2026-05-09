import Link from "next/link";

// AI assistant placeholder. Per R1 scope, AI features are deferred
// to R&D until the rest of the connectivity layer is proven. The
// icon ships in the header so the IA matches the v2 design.

export default function AiAssistantPage() {
  return (
    <main className="px-4 md:px-6 py-12 max-w-2xl mx-auto text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-violet-400 flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
          <path d="M19 14l.7 1.7L21.5 16.5l-1.7.7L19 19l-.7-1.7L16.5 16.5l1.7-.7L19 14z" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight">AI assistant</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Coming soon. The AI assistant will help you draft announcements, summarise work-order
        backlogs, and answer building-policy questions. We&apos;re finishing the connectivity
        layer first.
      </p>
      <Link
        href="/team"
        className="mt-6 inline-flex px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm"
      >
        Back to team home
      </Link>
    </main>
  );
}
