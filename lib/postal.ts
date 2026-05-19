// Postal-code helpers. Canadian-first; US is recognised but not
// validated against state. Used by:
//   • signup — auto-derive region from postal code
//   • building creation — cross-check postal code against the
//     province the user picked
//   • resident onboarding — sanity-check that the resident's claimed
//     postal code matches the building's FSA (forward sortation area)

// Canadian postal format: A1A 1A1 (letter-digit-letter, optional
// space, digit-letter-digit). First letter encodes the postal
// district, which maps to a province.
const CA_PATTERN = /^[ABCEGHJ-NPRSTVXY]\d[A-Z][ -]?\d[A-Z]\d$/i;

// US ZIP: 5 digits, optional 4-digit extension.
const US_PATTERN = /^\d{5}(-\d{4})?$/;

// First letter of Canadian postal code → ISO 3166-2 subdivision code.
// Excludes D, F, I, O, Q, U, W, Z (not in use as first letters).
const CA_FIRST_LETTER_TO_PROVINCE: Record<string, string> = {
  A: "CA-NL", // Newfoundland & Labrador
  B: "CA-NS", // Nova Scotia
  C: "CA-PE", // Prince Edward Island
  E: "CA-NB", // New Brunswick
  G: "CA-QC", // Eastern Quebec
  H: "CA-QC", // Metro Montréal
  J: "CA-QC", // Western Quebec
  K: "CA-ON", // Eastern Ontario
  L: "CA-ON", // Central Ontario
  M: "CA-ON", // Metro Toronto
  N: "CA-ON", // Southwestern Ontario
  P: "CA-ON", // Northern Ontario
  R: "CA-MB", // Manitoba
  S: "CA-SK", // Saskatchewan
  T: "CA-AB", // Alberta
  V: "CA-BC", // British Columbia
  X: "CA-NT", // Northwest Territories & Nunavut (shared)
  Y: "CA-YT", // Yukon
};

export type PostalKind = "ca" | "us" | "other" | "invalid";

export function detectPostalKind(raw: string): PostalKind {
  const value = raw.trim();
  if (!value) return "invalid";
  if (CA_PATTERN.test(value)) return "ca";
  if (US_PATTERN.test(value)) return "us";
  if (/^[A-Z0-9 -]{3,12}$/i.test(value)) return "other";
  return "invalid";
}

/** Normalise a Canadian postal code to canonical "A1A 1A1" form. */
export function normalizeCanadian(raw: string): string {
  const clean = raw.replace(/\s|-/g, "").toUpperCase();
  if (clean.length !== 6) return raw.trim().toUpperCase();
  return `${clean.slice(0, 3)} ${clean.slice(3)}`;
}

/**
 * Return the ISO 3166-2 region code implied by a Canadian postal
 * code's first letter. Returns null if not Canadian or unrecognised.
 *
 * Note: postal districts occasionally span province lines near the
 * border (a few FSAs in Hull/Ottawa, for example). This is a "most
 * likely" inference, not a guarantee — surface it as a suggestion,
 * never an enforcement.
 */
export function regionFromCanadianPostal(raw: string): string | null {
  if (detectPostalKind(raw) !== "ca") return null;
  const firstLetter = raw.trim().charAt(0).toUpperCase();
  return CA_FIRST_LETTER_TO_PROVINCE[firstLetter] ?? null;
}

/**
 * Forward Sortation Area — first 3 chars of a Canadian postal code.
 * Roughly identifies a postal sorting region (often a neighbourhood
 * or small town). Two postal codes sharing an FSA are guaranteed to
 * be geographically close; useful for "is this resident plausibly
 * in this building?" cross-checks.
 */
export function fsaOf(raw: string): string | null {
  if (detectPostalKind(raw) !== "ca") return null;
  return normalizeCanadian(raw).slice(0, 3);
}

export type PostalValidationIssue =
  | { kind: "format"; message: string }
  | { kind: "region_mismatch"; message: string; suggestedRegion: string }
  | { kind: "fsa_mismatch"; message: string; expectedFsa: string };

/**
 * Validate a postal code against the user's claimed region (province).
 * Returns null when everything checks out, an issue otherwise.
 */
export function validatePostalAgainstRegion(
  raw: string,
  regionCode: string,
): PostalValidationIssue | null {
  const kind = detectPostalKind(raw);
  if (kind === "invalid") {
    return { kind: "format", message: "Postal code format doesn't look right." };
  }
  if (kind !== "ca") {
    // Non-Canadian postal codes — skip province check for now.
    return null;
  }
  const inferred = regionFromCanadianPostal(raw);
  if (inferred && inferred !== regionCode) {
    return {
      kind: "region_mismatch",
      message: `That postal code looks like ${inferred} but you picked ${regionCode}.`,
      suggestedRegion: inferred,
    };
  }
  return null;
}

/**
 * Cross-check a user's postal code against a building's postal code.
 * Returns null if they share an FSA (high confidence), an issue
 * otherwise. Doesn't enforce — caller decides whether to warn or
 * block.
 */
export function validatePostalAgainstBuilding(
  userPostal: string,
  buildingPostal: string,
): PostalValidationIssue | null {
  const userFsa = fsaOf(userPostal);
  const buildingFsa = fsaOf(buildingPostal);
  if (!userFsa || !buildingFsa) return null; // can't compare
  if (userFsa !== buildingFsa) {
    return {
      kind: "fsa_mismatch",
      message: `Your postal code is in ${userFsa}; the building is in ${buildingFsa}. Double-check this is the right building.`,
      expectedFsa: buildingFsa,
    };
  }
  return null;
}
