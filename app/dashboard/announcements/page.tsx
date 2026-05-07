import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AnnouncementsPage() {
  const { appUser } = await requireUser();

  const announcements = appUser.buildingId
    ? await prisma.announcement.findMany({
        where: { buildingId: appUser.buildingId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <main className="min-h-dvh px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Announcements</h1>

      {!appUser.buildingId ? (
        <p className="mt-8 text-sm text-muted-foreground">
          You'll see announcements once a Building Manager assigns you to a building.
        </p>
      ) : announcements.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {announcements.map((a) => (
            <li key={a.id} className="bg-card border border-border rounded-md p-5">
              <h2 className="font-semibold">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{a.body}</p>
              <p className="mt-4 text-xs text-muted-foreground/70">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
