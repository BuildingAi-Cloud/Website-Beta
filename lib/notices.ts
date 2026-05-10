// Ontario RTA notice definitions. Mirrors the LTB form names and the
// minimum remediation/termination periods specified in the Act. The
// payloads we store are intentionally a superset of what each form
// requires so future template versions don't need a migration.
//
// IMPORTANT — these templates produce LTB-style notices but are NOT
// official LTB forms. Tribunal filings still need the official PDF
// from tribunalsontario.ca/ltb/forms. We surface this in the UI.

export type NoticeType = "N4" | "N5" | "N12";

export type NoticeTemplate = {
  type: NoticeType;
  title: string;
  shortTitle: string;
  blurb: string;
  // Min days between service date and termination date (LTB rules).
  minDaysToTermination: number;
  // Min days the tenant has to remediate to void the notice.
  // null when remediation isn't possible (e.g. N12).
  remediationDays: number | null;
};

export const NOTICE_TEMPLATES: Record<NoticeType, NoticeTemplate> = {
  N4: {
    type: "N4",
    title: "Notice to End your Tenancy Early for Non-payment of Rent",
    shortTitle: "Non-payment of rent",
    blurb:
      "Use when the tenant owes rent. Tenant has 14 days to pay in full to void the notice (7 days for daily/weekly tenancies).",
    minDaysToTermination: 14,
    remediationDays: 14,
  },
  N5: {
    type: "N5",
    title: "Notice to End your Tenancy for Interfering with Others, Damage, or Overcrowding",
    shortTitle: "Substantial interference / damage / overcrowding",
    blurb:
      "Use for noise, harassment, willful damage, or too many people in a unit. Tenant has 7 days to correct the behaviour.",
    minDaysToTermination: 20,
    remediationDays: 7,
  },
  N12: {
    type: "N12",
    title: "Notice to End your Tenancy because the Landlord, a Purchaser or a Family Member Requires the Rental Unit",
    shortTitle: "Landlord's own use",
    blurb:
      "Use when the landlord, their spouse, child, parent, or a purchaser will move into the unit. Compensation of one month's rent is required.",
    minDaysToTermination: 60,
    remediationDays: null,
  },
};

// Per-type payload shape. Stored in Notice.payload (Json column).
export type N4Payload = {
  // Snapshot of the rent + arrears at time of service. Stored even if
  // the lease changes later so the notice remains historically accurate.
  monthlyRent: number;
  arrearsBreakdown: { period: string; amount: number }[];
  totalOwing: number;
  // The tenant must pay this much by remediationBy to void the notice.
  amountToVoid: number;
};

export type N5Payload = {
  reason: "interference" | "damage" | "overcrowding";
  incidents: { date: string; description: string }[];
  remedyRequested: string;
  // True if this is a "second N5" within 6 months — second has no
  // remediation period and runs the full termination clock.
  isSecondNoticeWithinSixMonths: boolean;
};

export type N12Payload = {
  beneficiary: "landlord" | "spouse" | "child" | "parent" | "caregiver" | "purchaser";
  beneficiaryName: string;
  compensationMonths: number; // typically 1
  affidavitAttached: boolean;
};

export type NoticePayload = N4Payload | N5Payload | N12Payload;

// Compute the earliest valid termination date given a service date.
// LTB rules round up to the end of the rental period in some cases —
// this is the *floor*, not the LTB-blessed final date.
export function earliestTerminationDate(type: NoticeType, servedAt: Date): Date {
  const t = NOTICE_TEMPLATES[type];
  return new Date(servedAt.getTime() + t.minDaysToTermination * 24 * 60 * 60 * 1000);
}

export function remediationDeadline(type: NoticeType, servedAt: Date): Date | null {
  const t = NOTICE_TEMPLATES[type];
  if (t.remediationDays === null) return null;
  return new Date(servedAt.getTime() + t.remediationDays * 24 * 60 * 60 * 1000);
}

export function formatMoney(amount: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
