import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getStagingRegulationById } from "@/lib/db/queries/staging";
import { VerificationDetailView } from "@/components/admin/VerificationDetailView";

export const metadata = {
  title: "Review Change — Curator Dashboard",
};

type Props = {
  params: Promise<{ changeId: string }>;
};

export default async function ReviewPage({ params }: Props) {
  const { changeId } = await params;
  const item = await getStagingRegulationById(changeId);

  if (!item) {
    notFound();
  }

  // Fetch current live regulation for comparison
  const currentReg = await prisma.regulation.findFirst({
    where: {
      compoundId: item.compoundId,
      countryId: item.countryId,
    },
    select: {
      status: true,
      requiredDocuments: true,
      quantityLimits: true,
      lastVerifiedAt: true,
      verifiedBy: true,
    },
  });

  const currentRegulation = currentReg
    ? {
        status: currentReg.status,
        requiredDocuments: currentReg.requiredDocuments,
        quantityLimits: currentReg.quantityLimits,
        lastVerifiedAt: currentReg.lastVerifiedAt?.toISOString() ?? null,
        verifiedBy: currentReg.verifiedBy,
      }
    : null;

  return (
    <VerificationDetailView
      item={item}
      currentRegulation={currentRegulation}
    />
  );
}
