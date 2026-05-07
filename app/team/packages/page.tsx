import { redirect } from "next/navigation";
import { requireTeam } from "@/lib/team";

export default async function TeamPackagesPage() {
  const { appUser } = await requireTeam();
  if (appUser.role !== "concierge" && appUser.role !== "building_manager") {
    redirect("/team");
  }

  return (
    <main className="px-4 md:px-6 py-8 md:py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight">Package log</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Concierge package tracking — placeholder for R1. Schema and API land in next iteration.
      </p>
    </main>
  );
}
