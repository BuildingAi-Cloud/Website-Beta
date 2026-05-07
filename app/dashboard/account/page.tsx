import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { ProfileForm, PasswordForm } from "./AccountForms";

export default async function AccountPage() {
  const { authUser, appUser } = await requireUser();

  return (
    <main className="min-h-dvh px-6 py-10 max-w-2xl mx-auto">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>

      <div className="mt-4 space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">{authUser.email}</p>
      </div>

      <section className="mt-8 bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Profile</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Shown on work orders and announcements you submit.
        </p>
        <div className="mt-4">
          <ProfileForm defaultName={appUser.name} defaultPhone={appUser.phone} />
        </div>
      </section>

      <section className="mt-6 bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Password</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          If you signed in with a temporary password from your building team, change it here.
        </p>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </section>
    </main>
  );
}
