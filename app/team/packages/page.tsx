import { redirect } from "next/navigation";
import { requireTeam } from "@/lib/team";

export default async function AdminPackagesPage() {
  const { appUser } = await requireTeam();
  if (appUser.role !== "concierge" && appUser.role !== "building_manager") {
    redirect("/team");
  }

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Package log</h1>
      <p className="mt-3 text-sm opacity-70">
        Concierge package tracking — placeholder for R1. Schema and API land in next iteration.
      </p>
    </main>
  );
}
