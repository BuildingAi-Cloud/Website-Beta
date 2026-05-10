import Link from "next/link";
import type { Metadata } from "next";
import { Wordmark } from "@/components/ui";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — BuildingSync",
  description:
    "Get in touch with BuildingSync. Pilot, enterprise, support, press, or anything else — usually a reply within a business day.",
};

type SearchParams = { topic?: string };

const VALID_TOPICS = ["pilot", "enterprise", "support", "press", "other"] as const;
type Topic = (typeof VALID_TOPICS)[number];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const requested = (sp.topic || "").toLowerCase() as Topic;
  const defaultTopic: Topic = VALID_TOPICS.includes(requested) ? requested : "other";

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Wordmark />
          </Link>
          <nav className="text-sm text-muted-foreground flex items-center gap-4">
            <Link href="/walkthrough" className="hover:text-foreground transition-colors">Pilot</Link>
            <Link href="/enterprise" className="hover:text-foreground transition-colors">Enterprise</Link>
            <Link href="/signin" className="hover:text-foreground transition-colors">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Contact</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Get in touch</h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Pilot, Enterprise, Government, or just curious. Real humans on this side of the form — usually
          replies within a business day. For active customers, signed-in support is faster from the
          account menu inside the app.
        </p>

        <div className="mt-8 bg-card border border-border rounded-xl p-6 sm:p-8">
          <ContactForm defaultTopic={defaultTopic} />
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border border-border p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Pilot</p>
            <p className="mt-1 font-medium">First 5 residential buildings</p>
            <p className="mt-1 text-xs text-muted-foreground">90 days free, white-glove setup.</p>
            <Link href="/walkthrough" className="mt-2 inline-block text-xs text-accent hover:underline">
              Book a walkthrough →
            </Link>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Enterprise</p>
            <p className="mt-1 font-medium">Multi-building / regulated</p>
            <p className="mt-1 text-xs text-muted-foreground">SSO, dedicated tenancy, custom residency.</p>
            <Link href="/enterprise" className="mt-2 inline-block text-xs text-accent hover:underline">
              Read more →
            </Link>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Press</p>
            <p className="mt-1 font-medium">Founder + assets</p>
            <p className="mt-1 text-xs text-muted-foreground">Boilerplate, headshots, brand kit.</p>
            <Link href="/press" className="mt-2 inline-block text-xs text-accent hover:underline">
              Press kit →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
