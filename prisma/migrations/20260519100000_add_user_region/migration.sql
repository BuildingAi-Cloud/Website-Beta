-- Capture region, address, and BM verification fields on User.
-- All nullable so existing rows don't need backfilling.
-- New signups populate them through the location + verification step.

ALTER TABLE "User"
  ADD COLUMN "region"         TEXT,
  ADD COLUMN "postalCode"     TEXT,
  ADD COLUMN "city"           TEXT,
  ADD COLUMN "latitude"       DOUBLE PRECISION,
  ADD COLUMN "longitude"      DOUBLE PRECISION,
  ADD COLUMN "managerType"    TEXT,
  ADD COLUMN "businessNumber" TEXT,
  ADD COLUMN "licenseNumber"  TEXT;

-- Index on postalCode for building / unit cross-validation lookups.
CREATE INDEX "User_postalCode_idx" ON "User"("postalCode");
