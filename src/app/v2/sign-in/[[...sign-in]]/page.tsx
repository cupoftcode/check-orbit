import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main
      className="flex flex-1 items-center justify-center p-8"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-ink-3)" }}>
            Sign in to access your saved searches and alerts.
          </p>
        </div>
        <div
          style={{
            background: "var(--color-paper)",
            border: "1px solid var(--color-rule)",
            borderRadius: 18,
            padding: 4,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#DE6438",
                borderRadius: "12px",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
