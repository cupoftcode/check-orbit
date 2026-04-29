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
import { ComplianceStatus } from "@/types/compliance";

type Props = {
  medicationName: string;
  countryName: string;
  previousStatus: string;
  newStatus: string;
  changeDate: string;
  sourceDocument: string;
  sourceUrl: string;
  resultUrl: string;
  unsubscribeUrl: string;
};

const STATUS_LABEL: Record<string, string> = {
  [ComplianceStatus.LEGAL]: "Legal",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "Prescription Only",
  [ComplianceStatus.RESTRICTED]: "Restricted",
  [ComplianceStatus.BANNED]: "Banned",
};

const STATUS_COLOR: Record<string, string> = {
  [ComplianceStatus.LEGAL]: "#059669",
  [ComplianceStatus.PRESCRIPTION_ONLY]: "#0284c7",
  [ComplianceStatus.RESTRICTED]: "#d97706",
  [ComplianceStatus.BANNED]: "#e11d48",
};

export function RegulationChangeEmail({
  medicationName,
  countryName,
  previousStatus,
  newStatus,
  changeDate,
  sourceDocument,
  sourceUrl,
  resultUrl,
  unsubscribeUrl,
}: Props) {
  const prevLabel = STATUS_LABEL[previousStatus] ?? previousStatus;
  const newLabel = STATUS_LABEL[newStatus] ?? newStatus;
  const prevColor = STATUS_COLOR[previousStatus] ?? "#64748b";
  const newColor = STATUS_COLOR[newStatus] ?? "#64748b";

  return (
    <Html>
      <Head />
      <Preview>
        Regulation change: {medicationName} in {countryName} is now {newLabel}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <div
            style={{
              height: "4px",
              backgroundColor: newColor,
              borderRadius: "4px 4px 0 0",
            }}
          />

          <Section style={content}>
            <Heading style={h1}>Regulation Change Alert</Heading>

            <Text style={subtitle}>
              A regulation affecting your saved search has changed.
            </Text>

            <Section style={changeBox}>
              <Text style={changeMedication}>
                {medicationName} in {countryName}
              </Text>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: `${prevColor}18`,
                    color: prevColor,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "line-through",
                  }}
                >
                  {prevLabel}
                </span>
                <span style={{ color: "#94a3b8", fontSize: "16px" }}>→</span>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: `${newColor}18`,
                    color: newColor,
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {newLabel}
                </span>
              </div>
            </Section>

            <Section style={detailSection}>
              <Text style={detailLabel}>Change Date</Text>
              <Text style={detailValue}>{changeDate}</Text>
            </Section>

            <Section style={detailSection}>
              <Text style={detailLabel}>Source</Text>
              <Text style={detailValue}>{sourceDocument}</Text>
              {sourceUrl && (
                <Link href={sourceUrl} style={link}>
                  View source document
                </Link>
              )}
            </Section>

            <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
              <Link href={resultUrl} style={button}>
                View updated compliance result
              </Link>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              You&apos;re receiving this because you saved {medicationName} +{" "}
              {countryName} on Check Orbit.{" "}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe from this alert
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
  margin: "0 0 8px",
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0 0 20px",
};

const changeBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px",
};

const changeMedication = {
  fontSize: "16px",
  fontWeight: 600 as const,
  color: "#0f172a",
  margin: "0",
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

const footer = {
  fontSize: "11px",
  color: "#94a3b8",
  lineHeight: "1.5",
  margin: "0",
};
