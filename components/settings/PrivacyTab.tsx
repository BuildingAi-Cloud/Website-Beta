import Link from "next/link";
import type { LocaleCode } from "@/lib/locale";
import { LOCALES } from "@/lib/locale";

// Privacy & data tab. PIPEDA + Loi 25 expect easy access to: the
// privacy policy, data export request, and account-deletion request.
// Region/locale is shown so users know where their cookie + locale
// preference is set.

export function PrivacyTab({
  email,
  locale,
}: {
  email: string;
  locale: LocaleCode;
}) {
  const meta = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const exportSubject = encodeURIComponent("Data export request");
  const exportBody = encodeURIComponent(
    `Account: ${email}\n\nPlease provide a copy of all personal data BuildingSync holds about my account, in machine-readable form.`,
  );
  const deleteSubject = encodeURIComponent("Account deletion request");
  const deleteBody = encodeURIComponent(
    `Account: ${email}\n\nPlease delete my BuildingSync account and all associated personal data, retaining only what's required for legal/audit-trail purposes (PIPEDA s. 4.5).`,
  );

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Privacy policy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          PIPEDA-aligned with cross-border, breach-notification, and Loi 25 sections. Always the
          source of truth for what we collect and why.
        </p>
        <Link
          href="/privacy"
          className="mt-3 inline-flex px-3 py-1.5 rounded-md border border-border hover:bg-muted text-sm transition-colors"
        >
          Read privacy policy →
        </Link>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Data export</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a copy of the personal data we hold about your account. We respond within 30
          days as required by PIPEDA.
        </p>
        <a
          href={`mailto:info@buildingsync.app?subject=${exportSubject}&body=${exportBody}`}
          className="mt-3 inline-flex px-3 py-1.5 rounded-md border border-border hover:bg-muted text-sm transition-colors"
        >
          Email a data export request
        </a>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Delete your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll permanently remove your profile and personal data, keeping only what&apos;s
          legally required for audit-trail purposes (e.g. evidence of past payment activity for
          landlord-tenant disputes).
        </p>
        <a
          href={`mailto:info@buildingsync.app?subject=${deleteSubject}&body=${deleteBody}`}
          className="mt-3 inline-flex px-3 py-1.5 rounded-md border border-rose-500/40 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 text-sm transition-colors"
        >
          Email an account-deletion request
        </a>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Region &amp; data residency</h2>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-background border border-border rounded-md px-4 py-3">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Locale
            </dt>
            <dd className="mt-1 font-semibold">{meta.label}</dd>
          </div>
          <div className="bg-background border border-border rounded-md px-4 py-3">
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
    </div>
  );
}
