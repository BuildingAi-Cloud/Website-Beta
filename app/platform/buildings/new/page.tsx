import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform";
import { Card, Field } from "@/components/ui";
import { createBuilding } from "./actions";

export default async function NewBuildingPage() {
  await requirePlatformAdmin();

  return (
    <main className="px-6 py-10 max-w-xl mx-auto">
      <Link href="/platform" className="text-sm text-muted-foreground hover:text-foreground">← Back to platform</Link>

      <div className="mt-4 space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Onboard a building</h1>
        <p className="text-sm text-muted-foreground">
          Adds the building to the platform. Assign a Building Manager from the Users page once it exists.
        </p>
      </div>

      <Card className="mt-8 p-6">
        <form action={createBuilding} className="space-y-4">
          <Field name="name" label="Building name" placeholder="123 Main Tower" required />
          <Field name="address" label="Address" placeholder="123 Main St" required />
          <div className="grid grid-cols-3 gap-3">
            <Field name="city" label="City" placeholder="Toronto" required />
            <Field name="state" label="State / Prov." placeholder="ON" required />
            <Field name="zipCode" label="Postal code" placeholder="M5V 1A1" required />
          </div>
          <Field name="timezone" label="Timezone" placeholder="America/New_York" defaultValue="America/New_York" />

          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create building
          </button>
        </form>
      </Card>
    </main>
  );
}
