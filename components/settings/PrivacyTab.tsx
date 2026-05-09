import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { LOCALES } from "@/lib/locale";
import { PrivacyActions } from "./PrivacyActions";

// Privacy & data tab. Real data export (JSON download) + account
// archive request, plus the policy + region/locale info. PIPEDA Art.
// 4.5 + GDPR Art. 20 alignment: portability is on demand, deletion
// is a soft-archive that respects retention obligations.

export function PrivacyTab({
  email,
  locale,
  archived,
}: {
  email: string;
  locale: LocaleCode;
  archived: boolean;
}) {
  const meta = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Download my data</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Get a JSON export of your profile, leases, payments, work orders, and audit-log entries.
          Generated on demand — no waiting period. Your right under PIPEDA and GDPR Art. 20.
        </p>
        <div className="mt-4">
          <a
            href="/api/me/data-export"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download export
          </a>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Open the JSON file in any text editor or spreadsheet tool.
        </p>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Delete my account</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Account deletion is handled as an archive: your login is deactivated, and your records
          (lease, payments, work orders) are preserved for the retention window required by your
          building&apos;s residential community policy and applicable regulations. After the
          window, records are permanently purged.
        </p>
        <div className="mt-4">
          <PrivacyActions archived={archived} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          You can also email{" "}
          <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
            info@buildingsync.app
          </a>{" "}
          and we&apos;ll process within 30 days.
        </p>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Region &amp; data residency</h2>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-background border border-border rounded-md px-4 py-3">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Account email
            </dt>
            <dd className="mt-1 font-mono text-xs break-all">{email}</dd>
          </div>
          <div className="bg-background border border-border rounded-md px-4 py-3">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Locale
            </dt>
            <dd className="mt-1 font-semibold">{meta.label}</dd>
          </div>
          <div className="bg-background border border-border rounded-md px-4 py-3 sm:col-span-2">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Primary data region
            </dt>
            <dd className="mt-1 font-semibold">US-West (Supabase)</dd>
            <dd className="mt-0.5 text-xs text-muted-foreground">
              Canadian data residency lands ahead of QC/federal customer onboarding.
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Retention &amp; portability policy</h2>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          See the{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>{" "}
          for the full policy on data retention, encryption, and your rights as a user.
        </p>
      </section>
    </div>
  );
}
