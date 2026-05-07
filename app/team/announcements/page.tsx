import { redirect } from "next/navigation";
import { requireTeam } from "@/lib/team";
import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "./AnnouncementForm";

export default async function TeamAnnouncementsPage() {
  const { appUser } = await requireTeam();
  if (appUser.role !== "building_manager") redirect("/team");

  const announcements = appUser.buildingId
    ? await prisma.announcement.findMany({
        where: { buildingId: appUser.buildingId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight">Announcements</h1>

      <section className="mt-8 bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Post a new announcement</h2>
        <AnnouncementForm hasBuilding={Boolean(appUser.buildingId)} />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Posted</h2>
        {announcements.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">None yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {announcements.map((a) => (
              <li key={a.id} className="bg-card border border-border rounded-md p-4">
                <h3 className="font-medium">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{a.body}</p>
                <p className="mt-3 text-xs text-muted-foreground/70">{new Date(a.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
