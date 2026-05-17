-- On-prem appliance license records.
-- See prisma/schema.prisma > OnpremLicense for the modeled side.

CREATE TABLE "OnpremLicense" (
  "id"                    TEXT      PRIMARY KEY,
  "licenseKey"            TEXT      NOT NULL,
  "customerOrg"           TEXT      NOT NULL,
  "contactEmail"          TEXT      NOT NULL,
  "notes"                 TEXT,
  "features"              TEXT[]    NOT NULL DEFAULT '{}',
  "maxBuildings"          INTEGER   NOT NULL DEFAULT 10,
  "maxUnits"              INTEGER   NOT NULL DEFAULT 1000,
  "expiresAt"             TIMESTAMP(3) NOT NULL,
  "revokedAt"             TIMESTAMP(3),
  "revokedReason"         TEXT,
  "applianceId"           TEXT,
  "applianceFingerprint"  TEXT,
  "lastCheckedAt"         TIMESTAMP(3),
  "lastReportedVersion"   TEXT,
  "lastReportedIp"        TEXT,
  "issuedById"            TEXT,
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "OnpremLicense_licenseKey_key" ON "OnpremLicense"("licenseKey");
CREATE INDEX "OnpremLicense_customerOrg_idx"    ON "OnpremLicense"("customerOrg");
CREATE INDEX "OnpremLicense_expiresAt_idx"      ON "OnpremLicense"("expiresAt");
