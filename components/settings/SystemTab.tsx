import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import type { LocaleCode } from "@/lib/locale";

// Appearance + locale + meta. Theme/locale persist via the existing
// shared components (cookie-backed locale, localStorage theme).

export function SystemTab({
  locale,
  buildVersion,
}: {
  locale: LocaleCode;
  buildVersion: string;
}) {
  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three contrast modes: Paper (default after login), Light, and Dark. All meet AA
          contrast ratios.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border border-border rounded-md px-4 py-3">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Language &amp; region</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Switcher mechanism is wired; full string translations roll out after R1. French (Canada)
          is on the roadmap to support QC + federal customers.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border border-border rounded-md px-4 py-3">
          <span className="text-sm font-medium">Language</span>
          <LocaleSwitcher current={locale} />
        </div>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">About</h2>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-background border border-border rounded-md px-4 py-3">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Build
            </dt>
            <dd className="mt-1 font-mono">{buildVersion}</dd>
          </div>
          <div className="bg-background border border-border rounded-md px-4 py-3">
            <dt className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Release channel
            </dt>
            <dd className="mt-1 font-semibold">R1 beta</dd>
          </div>
        </dl>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Help &amp; support</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Email{" "}
          <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
            info@buildingsync.app
          </a>{" "}
          for product support, security reports, or compliance questions.
        </p>
      </section>
    </div>
  );
}
