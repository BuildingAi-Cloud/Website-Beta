// Subscription & Billing read-only display. Read-only because per
// R1 the SaaS billing flow is admin-managed (control-plane is
// deferred). Cloud margin / cost assumptions are NOT exposed here —
// those are platform-internal and would only confuse a BM.

type Customer =
  | "building_owner"
  | "property_manager"
  | "facility_manager"
  | "building_manager"
  | "concierge"
  | "resident"
  | "tenant"
  | "admin";

const PLAN_LABEL: Record<Customer, string> = {
  building_owner:    "Essential",
  property_manager:  "Professional",
  building_manager:  "Essential",
  facility_manager:  "Per-seat (covered by building plan)",
  concierge:         "Per-seat (covered by building plan)",
  resident:          "Included with your building",
  tenant:            "Included with your building",
  admin:             "Platform staff",
};

const CUSTOMER_TYPE_LABEL: Record<Customer, string> = {
  building_owner:    "building owner",
  property_manager:  "property manager",
  building_manager:  "building owner",
  facility_manager:  "staff",
  concierge:         "staff",
  resident:          "resident",
  tenant:            "tenant",
  admin:             "platform",
};

function StatField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-background border border-border rounded-md px-4 py-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function BillingTab({
  role,
  buildingName,
}: {
  role: string;
  buildingName: string | null;
}) {
  const customer = (role as Customer) || "resident";

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Subscription &amp; Billing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only summary of your plan. Plan changes during R1 happen by emailing{" "}
          <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
            info@buildingsync.app
          </a>
          .
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatField label="Plan" value={PLAN_LABEL[customer]} />
          <StatField label="Customer type" value={CUSTOMER_TYPE_LABEL[customer]} />
          <StatField label="Status" value="Active" />
          <StatField label="Next billing" value="Not set" hint="Billing pauses during R1 beta." />
          {buildingName && <StatField label="Building" value={buildingName} />}
        </div>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Online rent payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stripe is integrated but currently disabled while compliance review is pending. Tenants
          will see a clear &quot;pending compliance&quot; notice on the Pay rent page until we
          flip the switch. Stripe processing fees on rent will be absorbed by the property manager
          per Ontario RTA s. 134.
        </p>
        <span className="mt-3 inline-flex text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10">
          Pending compliance
        </span>
      </section>

      <section className="bg-card border border-border rounded-md p-5">
        <h2 className="text-base font-semibold">Invoices</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Self-serve invoice history is coming with the billing portal. For now, request an invoice
          copy from{" "}
          <a href="mailto:info@buildingsync.app" className="text-accent hover:underline">
            info@buildingsync.app
          </a>
          .
        </p>
      </section>
    </div>
  );
}
