import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SavedSearchList } from "@/components/account/SavedSearchList";
import { getSavedSearchesWithChangeStatus } from "@/lib/db/queries/saved-searches";

export const metadata = {
  title: "Saved Searches — Check Orbit",
  description: "View and manage your saved medication compliance searches.",
};

export default async function AccountPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/v2/sign-in");
  }

  const searches = await getSavedSearchesWithChangeStatus(userId);

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
        Saved Searches
      </h2>
      <SavedSearchList searches={searches} />
    </section>
  );
}
