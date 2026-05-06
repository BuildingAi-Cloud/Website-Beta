import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform";
import { createBuilding } from "./actions";

export default async function NewBuildingPage() {
  await requirePlatformAdmin();

  return (
    <main className="px-6 py-10 max-w-xl mx-auto">
      <Link href="/platform" className="text-sm opacity-70 hover:opacity-100">← Back to platform</Link>
      <h1 className="mt-4 text-3xl font-semibold">Onboard a building</h1>
      <p className="mt-1 text-sm opacity-70">
        Adds the building to the platform. Assign a Building Manager from the Users page once it exists.
      </p>

      <form action={createBuilding} className="mt-8 space-y-4">
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
          className="px-4 py-2 rounded-md font-medium"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          Create building
        </button>
      </form>
    </main>
  );
}

function Field({ name, label, placeholder, required, defaultValue }: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <input
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 rounded-md border bg-transparent"
        style={{ borderColor: "currentColor" }}
      />
    </label>
  );
}
