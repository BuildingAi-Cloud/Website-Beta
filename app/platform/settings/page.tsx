import { requirePlatformAdmin } from "@/lib/platform";
import { getLocale } from "@/lib/locale-server";
import { SettingsShell, parseTab } from "@/components/SettingsShell";
import { ProfileForm, PasswordForm } from "@/app/dashboard/account/AccountForms";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { BillingTab } from "@/components/settings/BillingTab";
import { PrivacyTab } from "@/components/settings/PrivacyTab";
import { SystemTab } from "@/components/settings/SystemTab";

const BASE = "/platform/settings";

export default async function PlatformSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { authUser, appUser } = await requirePlatformAdmin();
  const params = (await searchParams) || {};
  const active = parseTab(params.tab);
  const locale = await getLocale();

  return (
    <SettingsShell
      basePath={BASE}
      backHref="/platform"
      backLabel="platform overview"
      role={appUser.role}
      active={active}
    >
      {active === "profile" && (
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-md p-5">
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Used in audit logs and verification decisions you make.
            </p>
            <div className="mt-4">
              <ProfileForm defaultName={appUser.name} defaultPhone={appUser.phone} />
            </div>
          </section>
          <section className="bg-card border border-border rounded-md p-5">
            <h2 className="text-base font-semibold">Password</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Rotate the temporary password you were issued at onboarding.
            </p>
            <div className="mt-4">
              <PasswordForm />
            </div>
          </section>
        </div>
      )}
      {active === "notifications" && (
        <NotificationsTab
          email={authUser.email!}
          initial={{
            email: appUser.notifyEmail,
            sms: appUser.notifySms,
            inApp: appUser.notifyInApp,
          }}
          vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null}
        />
      )}
      {active === "billing" && <BillingTab role={appUser.role} buildingName={null} />}
      {active === "privacy" && (
        <PrivacyTab email={authUser.email!} locale={locale} archived={Boolean(appUser.archivedAt)} />
      )}
      {active === "system" && <SystemTab locale={locale} buildVersion="r1.beta" />}
    </SettingsShell>
  );
}
