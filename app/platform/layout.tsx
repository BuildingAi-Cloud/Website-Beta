import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { authUser } = await requirePlatformAdmin();

  return (
    <div className="min-h-[100dvh]">
      <header
        className="border-b px-6 py-3 flex items-center justify-between"
        style={{ borderColor: "currentColor" }}
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">BuildingSync · Platform Admin</Link>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-60">{authUser.email}</span>
          <form action="/auth/signout" method="post">
            <button className="px-2 py-1 rounded-md border" style={{ borderColor: "currentColor" }}>
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
