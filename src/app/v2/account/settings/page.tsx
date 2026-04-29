import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSavedSearchesWithNotificationPrefs } from "@/lib/db/queries/notification-subscriptions";
import { NotificationPreferences } from "@/components/account/NotificationPreferences";

export const metadata = {
  title: "Settings — Check Orbit",
  description: "Manage your notification preferences and account settings.",
};

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/v2/sign-in");
  }

  // Fetch notification prefs and resolve medication/country names
  const searchPrefs = await getSavedSearchesWithNotificationPrefs(userId);

  // Resolve display names for medications and countries
  const medSlugs = [...new Set(searchPrefs.map((s) => s.medicationSlug))];
  const countryCodes = [...new Set(searchPrefs.map((s) => s.countryCode))];

  const [medications, countries] = await Promise.all([
    prisma.medication.findMany({
      where: { slug: { in: medSlugs } },
      select: { slug: true, brandName: true },
    }),
    prisma.country.findMany({
      where: { code: { in: countryCodes } },
      select: { code: true, name: true },
    }),
  ]);

  const medNameMap = new Map(medications.map((m) => [m.slug, m.brandName]));
  const countryNameMap = new Map(countries.map((c) => [c.code, c.name]));

  // Check global pause status from Clerk metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata as {
    notificationsPaused?: boolean;
  };
  const globalPaused = metadata?.notificationsPaused ?? false;

  const searchesWithNames = searchPrefs.map((s) => ({
    ...s,
    medicationName: medNameMap.get(s.medicationSlug) ?? s.medicationSlug,
    countryName: countryNameMap.get(s.countryCode) ?? s.countryCode,
  }));

  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontWeight: 800,
          fontSize: 20,
          color: "var(--color-ink)",
          marginBottom: 16,
        }}
      >
        Notification Settings
      </h2>
      <NotificationPreferences
        searches={searchesWithNames}
        globalPaused={globalPaused}
      />
    </section>
  );
}
