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

type Props = {
  medicationName: string;
  countryName: string;
  permitAuthority: string;
  applicationUrl: string | null;
  daysUntilDeparture: number;
  permitLeadTimeDays: number;
  isPastDeadline: boolean;
  resultUrl: string;
  unsubscribeUrl: string;
};

export function PermitReminderEmail({
  medicationName,
  countryName,
  permitAuthority,
  applicationUrl,
  daysUntilDeparture,
  permitLeadTimeDays,
  isPastDeadline,
  resultUrl,
  unsubscribeUrl,
}: Props) {
  const urgencyColor = isPastDeadline
    ? "#e11d48"
    : daysUntilDeparture <= 7
      ? "#d97706"
      : "#0284c7";

  return (
    <Html>
      <Head />
      <Preview>
        {isPastDeadline
          ? `Permit deadline passed — ${medicationName} for ${countryName}`
          : `Permit reminder: ${daysUntilDeparture} days until departure — ${medicationName}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <div
            style={{
              height: "4px",
              backgroundColor: urgencyColor,
              borderRadius: "4px 4px 0 0",
            }}
          />

          <Section style={content}>
            <Heading style={h1}>Permit Deadline Reminder</Heading>

            <Text style={subtitle}>
              {medicationName} in {countryName}
            </Text>

            {/* Countdown box */}
            <Section
              style={{
                ...countdownBox,
                borderColor: urgencyColor,
              }}
            >
              <Text
                style={{
                  ...countdownNumber,
                  color: urgencyColor,
                }}
              >
                {daysUntilDeparture}
              </Text>
              <Text style={countdownLabel}>days until departure</Text>
            </Section>

            {isPastDeadline ? (
              <Section style={detailSection}>
                <Text style={{ ...detailValue, color: "#e11d48" }}>
                  The minimum lead time of {permitLeadTimeDays} days has passed.
                  Your departure is in {daysUntilDeparture} days.
                </Text>
              </Section>
            ) : (
              <Section style={detailSection}>
                <Text style={detailValue}>
                  This medication requires a permit with a minimum lead time of{" "}
                  <strong>{permitLeadTimeDays} days</strong>. Make sure to apply
                  before it&apos;s too late.
                </Text>
              </Section>
            )}

            <Section style={detailSection}>
              <Text style={detailLabel}>Permit Authority</Text>
              <Text style={detailValue}>{permitAuthority}</Text>
            </Section>

            {applicationUrl && (
              <Section
                style={{
                  textAlign: "center" as const,
                  marginTop: "20px",
                }}
              >
                <Link href={applicationUrl} style={primaryButton}>
                  Apply for permit
                </Link>
              </Section>
            )}

            <Section
              style={{
                textAlign: "center" as const,
                marginTop: "12px",
              }}
            >
              <Link href={resultUrl} style={secondaryButton}>
                View full compliance details
              </Link>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              You&apos;re receiving this permit reminder because you saved{" "}
              {medicationName} + {countryName} with a departure date on Check
              Orbit.{" "}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe from reminders
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
  fontSize: "16px",
  fontWeight: 600 as const,
  color: "#334155",
  margin: "0 0 20px",
};

const countdownBox = {
  textAlign: "center" as const,
  border: "2px solid",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "20px",
};

const countdownNumber = {
  fontSize: "36px",
  fontWeight: 800 as const,
  margin: "0",
  lineHeight: "1",
};

const countdownLabel = {
  fontSize: "13px",
  color: "#64748b",
  margin: "4px 0 0",
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

const primaryButton = {
  display: "inline-block" as const,
  backgroundColor: "#0f172a",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600 as const,
  textDecoration: "none" as const,
};

const secondaryButton = {
  display: "inline-block" as const,
  backgroundColor: "#f1f5f9",
  color: "#334155",
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 600 as const,
  textDecoration: "none" as const,
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

const footer = {
  fontSize: "11px",
  color: "#94a3b8",
  lineHeight: "1.5",
  margin: "0",
};
