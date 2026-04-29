-- CreateEnum
CREATE TYPE "AiConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('APPROVED', 'REJECTED', 'ESCALATED');

-- CreateTable
CREATE TABLE "staging_regulations" (
    "id" TEXT NOT NULL,
    "compoundId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "proposedStatus" "ComplianceStatus" NOT NULL,
    "regulatoryAuthority" TEXT,
    "requiredDocuments" TEXT,
    "quantityLimits" TEXT,
    "permitAuthority" TEXT,
    "permitApplicationUrl" TEXT,
    "permitLeadTimeDays" INTEGER,
    "dosageThreshold" TEXT,
    "biosecurityFlag" BOOLEAN NOT NULL DEFAULT false,
    "biosecurityDetails" TEXT,
    "sourceDocumentTitle" TEXT NOT NULL,
    "sourceDocumentUrl" TEXT NOT NULL,
    "aiConfidence" "AiConfidence" NOT NULL,
    "aiExtractedText" TEXT NOT NULL,
    "aiTranslation" TEXT,
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "escalationNotes" TEXT,

    CONSTRAINT "staging_regulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_trail" (
    "id" TEXT NOT NULL,
    "regulationId" TEXT,
    "stagingId" TEXT,
    "action" "AuditAction" NOT NULL,
    "previousData" JSONB,
    "newData" JSONB,
    "sourceCitation" TEXT,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "audit_trail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staging_regulations_compoundId_countryId_idx" ON "staging_regulations"("compoundId", "countryId");

-- CreateIndex
CREATE INDEX "staging_regulations_reviewStatus_idx" ON "staging_regulations"("reviewStatus");

-- CreateIndex
CREATE INDEX "staging_regulations_aiConfidence_idx" ON "staging_regulations"("aiConfidence");

-- CreateIndex
CREATE INDEX "audit_trail_performedAt_idx" ON "audit_trail"("performedAt");

-- CreateIndex
CREATE INDEX "audit_trail_regulationId_idx" ON "audit_trail"("regulationId");

-- AddForeignKey
ALTER TABLE "staging_regulations" ADD CONSTRAINT "staging_regulations_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staging_regulations" ADD CONSTRAINT "staging_regulations_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
