import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { LinkButton, Wordmark } from "@/components/ui";

const ADMIN_HOST = process.env.ADMIN_HOST || "admin.buildingsync.app";

type SP = Promise<{ go?: string }>;

export default async function Home({ searchParams }: { searchParams: SP }) {
  const h = await headers();
  const host = h.get("host") || "";
  const isAdminHost = host === ADMIN_HOST || host.startsWith("admin.");

  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();

  // Resolve the user's portal target so the landing CTA can either link
  // them in (authed) or invite sign-in (anonymous). The redirect only
  // fires when arriving via /?go=1 (set by /signin) — otherwise we let
  // signed-in visitors browse the public www landing freely.
  const params = await searchParams;
  let portalUrl: string | null = null;
  let portalLabel = "Continue";
  if (user) {
    const appUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (appUser) {
      switch (appUser.role) {
        case "platform_admin":
          portalUrl =
            isAdminHost || process.env.NODE_ENV !== "production"
              ? "/platform"
              : `https://${ADMIN_HOST}/platform`;
          portalLabel = "Open admin";
          break;
        case "building_manager":
        case "facility_manager":
        case "concierge":
          portalUrl = "/team";
          portalLabel = "Open team";
          break;
        default:
          portalUrl = "/dashboard";
          portalLabel = "Open dashboard";
      }
      if (params.go === "1") redirect(portalUrl);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <Wordmark className="text-3xl block" />
        <h1 className="text-5xl sm:text-6xl font-display tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Run your building<br />from one place.
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Maintenance, announcements, and payments for residents, tenants, and the team that keeps the lights on.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          {portalUrl ? (
            <LinkButton href={portalUrl}>{portalLabel}</LinkButton>
          ) : (
            <>
              <LinkButton href="/signin">Sign in</LinkButton>
              <LinkButton href="/signup" variant="outline">Sign up</LinkButton>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground/70 pt-8">R1 · {process.env.NODE_ENV}</p>
      </div>
    </main>
  );
}
