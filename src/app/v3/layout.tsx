import type { Metadata } from "next";
import { Montserrat, Open_Sans, JetBrains_Mono } from "next/font/google";
import { V3Header } from "@/components/v3/V3Header";
import { V3Footer } from "@/components/v3/V3Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CheckOrbit — Travel medication compliance",
  description:
    "Verified, source-cited compliance answers for any medication at any destination.",
};

export default function V3Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-v3
      className={`${montserrat.variable} ${openSans.variable} ${jetbrainsMono.variable} co-scope flex min-h-screen flex-col bg-cream text-ink`}
    >
      <a
        href="#v3-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:border focus:border-rule focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <V3Header />
      <div id="v3-main" className="flex flex-1 flex-col">
        {children}
      </div>
      <V3Footer />
    </div>
  );
}
