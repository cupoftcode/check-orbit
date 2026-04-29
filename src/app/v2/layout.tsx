import type { Metadata } from "next";
import { Montserrat, Open_Sans, JetBrains_Mono } from "next/font/google";
import { V2Header } from "@/components/v2/V2Header";
import { V2Footer } from "@/components/v2/V2Footer";

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

export default function V2Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-v2
      className={`${montserrat.variable} ${openSans.variable} ${jetbrainsMono.variable} co-scope flex flex-1 flex-col bg-cream text-ink font-sans`}
    >
      <a
        href="#v2-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-md focus:px-4 focus:py-2 bg-paper border border-rule"
      >
        Skip to content
      </a>
      <V2Header />
      <div id="v2-main" className="flex flex-1 flex-col">
        {children}
      </div>
      <V2Footer />
    </div>
  );
}
