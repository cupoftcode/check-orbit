"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

type Result =
  | { success: true }
  | { success: false; error: string };

export async function deleteSearch(searchId: string): Promise<Result> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const search = await prisma.savedSearch.findUnique({
      where: { id: searchId },
    });

    if (!search || search.userId !== userId) {
      return { success: false, error: "Search not found." };
    }

    await prisma.savedSearch.delete({
      where: { id: searchId },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
