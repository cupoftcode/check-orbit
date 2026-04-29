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
    redirect("/sign-in");
  }

  const searches = await getSavedSearchesWithChangeStatus(userId);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Saved Searches</h2>
      <SavedSearchList searches={searches} />
    </section>
  );
}
