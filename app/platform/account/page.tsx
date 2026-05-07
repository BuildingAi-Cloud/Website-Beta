import { requireUser } from "@/lib/auth";
import { roleLabel } from "@/components/RoleBadge";
import { ProfileForm, PasswordForm } from "@/app/dashboard/account/AccountForms";

export default async function PlatformAccountPage() {
  const { authUser, appUser } = await requireUser();

  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-2xl mx-auto">
      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {roleLabel(appUser.role)}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">{authUser.email}</p>
      </div>

      <section className="mt-8 bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Profile</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown on the platform admin queue and audit log entries you create.
        </p>
        <div className="mt-4">
          <ProfileForm defaultName={appUser.name} defaultPhone={appUser.phone} />
        </div>
      </section>

      <section className="mt-6 bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Password</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          If you signed in with a temporary password from your invite email, change it here now.
        </p>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </section>
    </main>
  );
}
