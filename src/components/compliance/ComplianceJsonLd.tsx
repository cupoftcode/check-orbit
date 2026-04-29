import type { ComplianceResult } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
  url: string;
};

export function ComplianceJsonLd({ result, url }: Props) {
  const primary = result.compounds[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${result.medication} in ${result.country} — ${result.overallStatus}`,
    url,
    description: `${result.medication} is ${result.overallStatus} in ${result.country}. Verified regulatory compliance data.`,
    mainEntity: {
      "@type": "MedicalEntity",
      name: result.medication,
      relevantSpecialty: {
        "@type": "MedicalSpecialty",
        name: "Pharmacy",
      },
    },
    about: {
      "@type": "Country",
      name: result.country,
    },
    ...(primary?.lastVerifiedAt && {
      dateModified: primary.lastVerifiedAt,
    }),
    publisher: {
      "@type": "Organization",
      name: "Check Orbit",
      url: "https://checkorbit.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
