-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('LEGAL', 'PRESCRIPTION_ONLY', 'RESTRICTED', 'BANNED');

-- CreateEnum
CREATE TYPE "DisclosureLevel" AS ENUM ('FULL', 'PARTIAL', 'UNDISCLOSED');

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isCovered" BOOLEAN NOT NULL DEFAULT false,
    "flagEmoji" TEXT NOT NULL DEFAULT '',
    "popularityRank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "genericName" TEXT,
    "slug" TEXT NOT NULL,
    "proprietaryBlend" BOOLEAN NOT NULL DEFAULT false,
    "disclosureLevel" "DisclosureLevel" NOT NULL DEFAULT 'FULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compounds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "atcCode" TEXT,
    "casNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_compounds" (
    "medicationId" TEXT NOT NULL,
    "compoundId" TEXT NOT NULL,

    CONSTRAINT "medication_compounds_pkey" PRIMARY KEY ("medicationId","compoundId")
);

-- CreateTable
CREATE TABLE "regulations" (
    "id" TEXT NOT NULL,
    "compoundId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL,
    "regulatoryAuthority" TEXT NOT NULL,
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
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL,
    "verifiedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_notify_signups" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "medicationSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_notify_signups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "medications_slug_key" ON "medications"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regulations_compoundId_countryId_regulatoryAuthority_key" ON "regulations"("compoundId", "countryId", "regulatoryAuthority");

-- CreateIndex
CREATE UNIQUE INDEX "medication_notify_signups_email_medicationSlug_key" ON "medication_notify_signups"("email", "medicationSlug");

-- AddForeignKey
ALTER TABLE "medication_compounds" ADD CONSTRAINT "medication_compounds_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_compounds" ADD CONSTRAINT "medication_compounds_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulations" ADD CONSTRAINT "regulations_compoundId_fkey" FOREIGN KEY ("compoundId") REFERENCES "compounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulations" ADD CONSTRAINT "regulations_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
