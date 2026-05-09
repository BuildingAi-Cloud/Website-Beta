import Link from "next/link";

// Header search target — universal search across residents, work
// orders, announcements, documents, and incidents lands later. For
// now the icon is wired so the IA matches the v2 design and users can
// discover the surface.

export default function SearchPage() {
  return (
    <main className="px-4 md:px-6 py-12 max-w-2xl mx-auto text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight">Search</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        Universal search across residents, work orders, announcements, and documents lands soon.
        For now, use the per-section pages from the top nav.
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
