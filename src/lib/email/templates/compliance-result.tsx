import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ComplianceResult } from "@/types/compliance";
import { ComplianceStatus } from "@/types/compliance";

type Props = {
  result: ComplianceResult;
  resultUrl: string;
};

const STATUS_LABEL: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "Legal",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "Prescription Only",
  [ComplianceStatus.RESTRICTED]: "Restricted",
  [ComplianceStatus.BANNED]: "Banned",
};

const STATUS_COLOR: Record<ComplianceStatus, string> = {
  [ComplianceStatus.LEGAL]: "#059669",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "#0284c7",
  [ComplianceStatus.RESTRICTED]: "#d97706",
  [ComplianceStatus.BANNED]: "#e11d48",
};

export function ComplianceResultEmail({ result, resultUrl }: Props) {
  const primary = result.compounds[0];
  const statusLabel = STATUS_LABEL[result.overallStatus];
  const statusColor = STATUS_COLOR[result.overallStatus];

  return (
    <Html>
      <Head />
      <Preview>
        {result.medication} is {statusLabel} in {result.country}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Status bar */}
          <div
            style={{
              height: "4px",
              backgroundColor: statusColor,
              borderRadius: "4px 4px 0 0",
            }}
          />

          <Section style={content}>
            <Heading style={h1}>
              {result.medication} in {result.country}
            </Heading>

            <div
              style={{
                display: "inline-block",
                backgroundColor: `${statusColor}18`,
                color: statusColor,
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {statusLabel}
            </div>

            {/* Key details */}
            {primary?.documentation && (
              <Section style={detailSection}>
                <Text style={detailLabel}>Required Documents</Text>
                <Text style={detailValue}>{primary.documentation}</Text>
              </Section>
            )}

            {primary?.quantityLimit && (
              <Section style={detailSection}>
                <Text style={detailLabel}>Quantity Limits</Text>
                <Text style={detailValue}>{primary.quantityLimit}</Text>
              </Section>
            )}

            {primary?.permitAuthority && (
              <Section style={detailSection}>
                <Text style={detailLabel}>Permit Details</Text>
                <Text style={detailValue}>
                  Authority: {primary.permitAuthority}
                  {primary.permitLeadTimeDays
                    ? ` | Lead time: ${primary.permitLeadTimeDays} days`
                    : ""}
                </Text>
                {primary.permitApplicationUrl && (
                  <Link href={primary.permitApplicationUrl} style={link}>
                    Apply for permit
                  </Link>
                )}
              </Section>
            )}

            {result.hasBiosecurityWarning && result.biosecurityDetails && (
              <Section style={detailSection}>
                <Text style={detailLabel}>Biosecurity Notice</Text>
                <Text style={detailValue}>{result.biosecurityDetails}</Text>
              </Section>
            )}

            <Hr style={hr} />

            {/* Source citation */}
            {primary && (
              <Section style={detailSection}>
                <Text style={detailLabel}>Source</Text>
                <Text style={detailValue}>
                  {primary.sourceDocument}
                  {primary.lastVerifiedAt &&
                    ` — Verified ${new Date(primary.lastVerifiedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                </Text>
                {primary.sourceUrl && (
                  <Link href={primary.sourceUrl} style={link}>
                    View source document
                  </Link>
                )}
              </Section>
            )}

            {/* CTA */}
            <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
              <Link href={resultUrl} style={button}>
                View full result on Check Orbit
              </Link>
            </Section>

            <Hr style={hr} />

            {/* Disclaimer */}
            <Text style={disclaimer}>{result.disclaimer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---

const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden" as const,
  border: "1px solid #e2e8f0",
};

const content = {
  padding: "32px 24px",
};

const h1 = {
  fontSize: "22px",
  fontWeight: 700 as const,
  color: "#0f172a",
  margin: "0 0 12px",
};

const detailSection = {
  marginTop: "16px",
};

const detailLabel = {
  fontSize: "12px",
  fontWeight: 600 as const,
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const detailValue = {
  fontSize: "14px",
  color: "#334155",
  margin: "0",
  lineHeight: "1.5",
};

const link = {
  color: "#2563eb",
  fontSize: "13px",
  textDecoration: "underline" as const,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const button = {
  display: "inline-block" as const,
  backgroundColor: "#0f172a",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600 as const,
  textDecoration: "none" as const,
};

const disclaimer = {
  fontSize: "11px",
  color: "#94a3b8",
  lineHeight: "1.5",
  margin: "0",
};
