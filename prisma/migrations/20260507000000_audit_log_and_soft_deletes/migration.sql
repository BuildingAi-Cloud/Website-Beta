-- AuditLog + soft-delete columns
-- Run via: npx prisma migrate deploy
-- Or apply manually via Supabase SQL editor.

-- 1. AuditAction enum
CREATE TYPE "AuditAction" AS ENUM (
  'create',
  'update',
  'delete',
  'role_change',
  'status_change',
  'password_reset',
  'login',
  'signout',
  'export'
);

-- 2. Soft-delete columns (nullable; existing rows untouched)
ALTER TABLE "User"         ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "WorkOrder"    ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Announcement" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "User_deletedAt_idx"         ON "User"("deletedAt");
CREATE INDEX "WorkOrder_deletedAt_idx"    ON "WorkOrder"("deletedAt");
CREATE INDEX "Announcement_deletedAt_idx" ON "Announcement"("deletedAt");

-- 3. AuditLog table
CREATE TABLE "AuditLog" (
  "id"         TEXT NOT NULL,
  "actorId"    UUID,
  "action"     "AuditAction" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId"   TEXT NOT NULL,
  "buildingId" TEXT,
  "before"     JSONB,
  "after"      JSONB,
  "metadata"   JSONB,
  "ipAddress"  TEXT,
  "userAgent"  TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_actorId_createdAt_idx"   ON "AuditLog"("actorId", "createdAt");
CREATE INDEX "AuditLog_buildingId_createdAt_idx" ON "AuditLog"("buildingId", "createdAt");
CREATE INDEX "AuditLog_createdAt_idx"            ON "AuditLog"("createdAt");

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
