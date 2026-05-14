import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Help Centre — BuildingSync",
  description:
    "Everything you need to use BuildingSync — guides for residents, tenants, and property managers. Written in plain language, no jargon.",
};

export default function DocsPage() {
  return (
    <AuthShell back={{ href: "/", label: "Home" }} width="wide">
      <div className="py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Help Centre</p>
        <h1
          className="mt-3 tracking-tight"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
        >
          GUIDES &amp; SUPPORT
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Plain-language guides for getting the most out of BuildingSync.
          Whether you live in a building or run one, you&apos;ll find what you
          need here.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href="#residents" className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors">
            For residents
          </a>
          <a href="#managers" className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors">
            For property managers
          </a>
          <a href="#account" className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors">
            Account &amp; security
          </a>
          <a href="#faq" className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors">
            FAQ
          </a>
          <a href="#contact" className="inline-flex items-center px-3 py-1.5 rounded-full border border-border text-xs hover:bg-muted transition-colors">
            Contact
          </a>
        </div>

        <div className="mt-14 space-y-16 text-sm leading-relaxed text-foreground/90">
          {/* Intro / what BuildingSync is */}
          <Section eyebrow="Introduction" title="What is BuildingSync?">
            <p>
              BuildingSync is the everyday operating system for residential
              buildings — a single place where residents, tenants, and the
              building team stay connected. Submit a maintenance request,
              read an announcement, reserve an amenity, pick up a package,
              or pay rent without juggling email threads, group chats, or
              paper forms.
            </p>
            <p className="mt-3">
              It runs in your web browser and installs as an app on your
              phone. There&apos;s nothing to download from an app store, and
              nothing to maintain on your computer.
            </p>
          </Section>

          {/* Residents */}
          <Section eyebrow="For residents &amp; tenants" title="Living in a BuildingSync building" id="residents">
            <Card title="Getting started">
              When your building joins BuildingSync, your manager will set
              up an account for you and send a welcome email with a temporary
              password. Sign in, change your password, and you&apos;re ready.
              No app store, no installer, no extra steps.
            </Card>

            <Card title="Reporting a maintenance issue">
              Spot a leak, a broken light, or anything that needs a hand?
              Open <strong>Maintenance</strong>, describe the issue in your
              own words, and submit. Your building team is notified
              instantly, and you&apos;ll see updates as the work moves from
              acknowledged through scheduled to resolved — all in one
              place, all on the record.
            </Card>

            <Card title="Staying in the loop">
              Building-wide announcements — fire-alarm tests, elevator
              maintenance, holiday hours — appear in your dashboard and land
              in your inbox at the same time. No more wondering whether
              you missed a notice taped to the elevator.
            </Card>

            <Card title="Booking amenities">
              Reserve the party room, the BBQ, the guest suite, or whatever
              your building offers. You&apos;ll see what&apos;s available,
              pick a time, and get a confirmation. Your building team can
              see the schedule so there are no double-bookings.
            </Card>

            <Card title="Tracking packages">
              When a package arrives at the front desk, you&apos;ll get a
              notification with a pickup code. Show the code at pickup and
              you&apos;re done — no more wondering whether something
              actually arrived.
            </Card>

            <Card title="Paying rent (tenants only)">
              If you rent, your monthly rent appears in the <strong>Payments</strong>
              section. Pay securely by card or bank transfer in a couple
              of taps. Every payment is receipted automatically — handy at
              tax time or if a question ever comes up.
            </Card>

            <Card title="Installing the app">
              On your phone, your browser will offer to add BuildingSync to
              your home screen. Tap yes, and it behaves like any other app —
              launches full-screen, sends notifications, works offline for
              the basics.
            </Card>
          </Section>

          {/* Property managers */}
          <Section eyebrow="For property managers" title="Running your building" id="managers">
            <Card title="One platform, every persona">
              BuildingSync gives Building Managers, Facility Managers, and
              concierge staff the right tools for their role — and only
              those tools. Residents see resident things; staff see what
              they need to do their job; the manager sees everything.
              Permissions are sensible by default, so you don&apos;t spend
              your week tuning access.
            </Card>

            <Card title="Onboarding residents">
              Add residents one at a time or import them in bulk. Each one
              gets a welcome email with sign-in instructions. Existing
              BuildingSync users are simply linked to your building — no
              duplicate accounts, no migration drama.
            </Card>

            <Card title="Maintenance &amp; work orders">
              Every resident request lands in your queue with full context
              — the unit, the description, the timeline. Assign it, update
              the status, and the resident is kept in the loop
              automatically. Every change is logged for accountability.
            </Card>

            <Card title="Communicating with residents">
              Post an announcement and reach every resident in your
              building in seconds — in the app and in their email inbox.
              Target the whole building, only tenants, or specific units.
              No more taping printouts to the elevator.
            </Card>

            <Card title="Staff &amp; vendors">
              Hire facility managers, concierge, and security staff
              directly from your team page. They get accounts with the
              right permissions out of the box.
            </Card>

            <Card title="Records that hold up">
              Everything that happens — work-order updates, announcements
              posted, lease notices delivered — is logged with timestamps
              and the person who did it. If a dispute ever arises, you have
              the evidence you need without having to dig through email.
            </Card>
          </Section>

          {/* Account & security */}
          <Section eyebrow="Account &amp; security" title="Your account, your data" id="account">
            <Card title="Signing in">
              Your email address is your sign-in. Set a strong password
              when you first log in — our strength meter will tell you
              when it&apos;s good. Forgot it? Use the &ldquo;Forgot
              password?&rdquo; link on the sign-in page; we&apos;ll email a
              reset link that expires in an hour.
            </Card>

            <Card title="What we protect">
              Your data is encrypted in transit and at rest. We store as
              little as we need to make the service work, and we never
              sell personal information. Our infrastructure is hosted with
              tier-one providers in compliant data regions.
            </Card>

            <Card title="What other residents can see">
              Privacy by default. Other residents in your building
              don&apos;t see your maintenance requests, your payment
              history, or your contact details. Building staff see only
              what they need to help you.
            </Card>

            <Card title="Closing your account">
              You can request account deletion at any time from your
              account settings, or by emailing our support team. We delete
              your personal records on a documented timeline and confirm
              when it&apos;s done.
            </Card>
          </Section>

          {/* FAQ */}
          <Section eyebrow="Common questions" title="Frequently asked" id="faq">
            <FaqItem q="Do I need to download an app from the app store?">
              No. BuildingSync runs in your browser. On your phone, you
              can add it to your home screen and it behaves like a native
              app — no store, no waiting for updates, no extra permissions.
            </FaqItem>

            <FaqItem q="My welcome email never arrived. What now?">
              Check your spam folder first. If it&apos;s still missing,
              ask your building manager — they can re-send it or share
              your temporary password directly. Once you&apos;re signed
              in, change your password immediately.
            </FaqItem>

            <FaqItem q="Can I switch buildings if I move?">
              Yes. Your account follows you. When you arrive at a new
              BuildingSync building, your new manager links you to your
              new home and your old building access ends. No new accounts
              to create.
            </FaqItem>

            <FaqItem q="Is my information shared with my landlord or anyone else?">
              Only what&apos;s necessary. Your building team sees what
              they need to do their job — your unit, your work orders, the
              status of your account. They don&apos;t see your payment
              card details or your password. Your information is never
              sold or shared with advertisers.
            </FaqItem>

            <FaqItem q="What happens if the internet is down?">
              The app remembers your most recent activity and you can
              still browse what you&apos;ve already loaded. Submitting
              new requests requires a connection — they&apos;ll go through
              the moment you&apos;re back online.
            </FaqItem>

            <FaqItem q="Is there a fee for residents?">
              No. BuildingSync is paid for by the building. Residents and
              tenants use it free of charge. The only money residents pay
              through the platform is rent (for tenants who choose to pay
              that way) — and that goes straight to the landlord, not to
              BuildingSync.
            </FaqItem>

            <FaqItem q="What languages is BuildingSync available in?">
              BuildingSync is currently in English. French (Canadian) is
              on our roadmap. If you need another language for a building,
              get in touch.
            </FaqItem>
          </Section>

          {/* Contact */}
          <Section eyebrow="Contact" title="Still stuck? We&rsquo;re here." id="contact">
            <p>
              The fastest way to reach us is by email — we usually reply
              within one business day, often sooner.
            </p>
            <p className="mt-4">
              <a
                href="mailto:info@buildingsync.app"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                Email support
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Are you a property manager evaluating BuildingSync for your
              portfolio? Our team can run you through a 15-minute
              walkthrough — start at the{" "}
              <Link href="/for-property-managers" className="text-accent hover:underline">
                property managers page
              </Link>{" "}
              or book directly through{" "}
              <Link href="/contact" className="text-accent hover:underline">
                contact us
              </Link>
              .
            </p>
          </Section>

          {/* Developers note */}
          <div className="mt-4 rounded-lg border border-dashed border-border/70 bg-muted/30 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Developers
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Building a native iOS or Android client, or wiring BuildingSync
              into an existing system? Head to the{" "}
              <Link href="/developers" className="text-accent hover:underline">
                developer portal
              </Link>{" "}
              for the OpenAPI specification, authentication guide, and
              real-time sync notes.
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}

function Section({
  title,
  eyebrow,
  id,
  children,
}: {
  title: string;
  eyebrow: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group bg-card border border-border rounded-lg overflow-hidden">
      <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
        <span className="text-sm font-medium text-foreground">{q}</span>
        <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg leading-none">+</span>
      </summary>
      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </details>
  );
}
