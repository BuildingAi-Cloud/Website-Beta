"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { NOTICE_TEMPLATES, type NoticeType } from "@/lib/notices";
import { createNotice } from "../actions";

type Tenant = {
  id: string;
  label: string;
  unit: string | null;
  rentAmountMonthly: number | null;
};

export function NewNoticeForm({
  type,
  tenants,
  presetTenantId,
}: {
  type: NoticeType;
  tenants: Tenant[];
  presetTenantId: string | null;
}) {
  const tpl = NOTICE_TEMPLATES[type];
  const [tenantId, setTenantId] = useState<string>(presetTenantId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const tenant = useMemo(() => tenants.find((t) => t.id === tenantId) ?? null, [tenants, tenantId]);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createNotice(formData);
      if (res && res.ok === false) {
        setError(res.error);
        toast.error("Couldn't create notice", { description: res.error });
      }
    });
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-6">
      <input type="hidden" name="type" value={type} />

      <section className="bg-card border border-border rounded-md p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm border border-border bg-muted/40">
            {tpl.type}
          </span>
          <h2 className="text-base font-semibold">{tpl.shortTitle}</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{tpl.title}</p>
      </section>

      <section className="bg-card border border-border rounded-md p-5 space-y-4">
        <h3 className="text-sm font-semibold">Tenant</h3>
        <div>
          <label htmlFor="tenantUserId" className="text-sm font-medium block mb-1">
            Pick the tenant
          </label>
          <select
            id="tenantUserId"
            name="tenantUserId"
            required
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background"
          >
            <option value="">Select…</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}{t.unit ? ` · Unit ${t.unit}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      {type === "N4" && (
        <section className="bg-card border border-border rounded-md p-5 space-y-4">
          <h3 className="text-sm font-semibold">Rent owing</h3>
          <div>
            <label htmlFor="monthlyRent" className="text-sm font-medium block mb-1">
              Monthly rent (CAD)
            </label>
            <input
              id="monthlyRent"
              name="monthlyRent"
              type="number"
              min="0"
              step="0.01"
              defaultValue={tenant?.rentAmountMonthly ?? ""}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="arrearsPeriod" className="text-sm font-medium block mb-1">
                Period owed
              </label>
              <input
                id="arrearsPeriod"
                name="arrearsPeriod"
                type="text"
                required
                placeholder="e.g. November 2026"
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>
            <div>
              <label htmlFor="arrearsAmount" className="text-sm font-medium block mb-1">
                Amount owing (CAD)
              </label>
              <input
                id="arrearsAmount"
                name="arrearsAmount"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tenant has 14 days from service to pay the full amount above to void this notice.
          </p>
        </section>
      )}

      {type === "N5" && (
        <section className="bg-card border border-border rounded-md p-5 space-y-4">
          <h3 className="text-sm font-semibold">Reason + incident</h3>
          <div>
            <label htmlFor="reason" className="text-sm font-medium block mb-1">Reason</label>
            <select
              id="reason"
              name="reason"
              defaultValue="interference"
              className="w-full px-3 py-2 rounded-md border border-border bg-background"
            >
              <option value="interference">Substantial interference (noise, harassment)</option>
              <option value="damage">Willful or negligent damage</option>
              <option value="overcrowding">Overcrowding</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="incidentDate" className="text-sm font-medium block mb-1">Incident date</label>
              <input
                id="incidentDate"
                name="incidentDate"
                type="date"
                required
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                name="isSecondNotice"
                value="1"
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm">Second N5 within 6 months</span>
            </label>
          </div>
          <div>
            <label htmlFor="incidentDescription" className="text-sm font-medium block mb-1">
              What happened
            </label>
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              required
              rows={4}
              maxLength={2000}
              placeholder="Describe the incident in plain language. Include time, location, witnesses if any."
              className="w-full px-3 py-2 rounded-md border border-border bg-background resize-y"
            />
          </div>
          <div>
            <label htmlFor="remedyRequested" className="text-sm font-medium block mb-1">Remedy required</label>
            <textarea
              id="remedyRequested"
              name="remedyRequested"
              required
              rows={3}
              maxLength={1000}
              placeholder="What the tenant must do within 7 days to void the notice."
              className="w-full px-3 py-2 rounded-md border border-border bg-background resize-y"
            />
          </div>
        </section>
      )}

      {type === "N12" && (
        <section className="bg-card border border-border rounded-md p-5 space-y-4">
          <h3 className="text-sm font-semibold">Who will move in</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="beneficiary" className="text-sm font-medium block mb-1">Relationship</label>
              <select
                id="beneficiary"
                name="beneficiary"
                defaultValue="landlord"
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              >
                <option value="landlord">Landlord</option>
                <option value="spouse">Landlord&apos;s spouse</option>
                <option value="child">Landlord&apos;s child</option>
                <option value="parent">Landlord&apos;s parent</option>
                <option value="caregiver">Caregiver</option>
                <option value="purchaser">Purchaser</option>
              </select>
            </div>
            <div>
              <label htmlFor="beneficiaryName" className="text-sm font-medium block mb-1">Name</label>
              <input
                id="beneficiaryName"
                name="beneficiaryName"
                type="text"
                required
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="affidavitAttached"
              value="1"
              defaultChecked
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm">Affidavit of good faith attached</span>
          </label>
          <p className="text-xs text-muted-foreground">
            Compensation: one month&apos;s rent or an alternative unit. Required by RTA s. 48.1.
          </p>
        </section>
      )}

      {error && (
        <p className="text-sm text-rose-700 dark:text-rose-400" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending || !tenantId}
        className="px-5 py-2.5 rounded-md bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Creating…" : "Create draft notice"}
      </button>
    </form>
  );
}
