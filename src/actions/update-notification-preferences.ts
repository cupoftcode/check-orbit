"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

type Result =
  | { success: true }
  | { success: false; error: string };

/**
 * Toggle regulation alerts for a specific saved search.
 */
export async function toggleRegulationAlerts(
  savedSearchId: string,
  enabled: boolean
): Promise<Result> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    // Verify ownership
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: savedSearchId },
    });
    if (!savedSearch || savedSearch.userId !== userId) {
      return { success: false, error: "Saved search not found." };
    }

    await prisma.notificationSubscription.upsert({
      where: {
        userId_savedSearchId: { userId, savedSearchId },
      },
      update: { regulationAlerts: enabled, isActive: true },
      create: {
        userId,
        savedSearchId,
        regulationAlerts: enabled,
        permitReminders: true,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Toggle permit reminders for a specific saved search.
 */
export async function togglePermitReminders(
  savedSearchId: string,
  enabled: boolean
): Promise<Result> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: savedSearchId },
    });
    if (!savedSearch || savedSearch.userId !== userId) {
      return { success: false, error: "Saved search not found." };
    }

    await prisma.notificationSubscription.upsert({
      where: {
        userId_savedSearchId: { userId, savedSearchId },
      },
      update: { permitReminders: enabled, isActive: true },
      create: {
        userId,
        savedSearchId,
        regulationAlerts: true,
        permitReminders: enabled,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Update departure date for a saved search (used by permit reminders).
 */
export async function updateDepartureDate(
  savedSearchId: string,
  departureDate: string | null
): Promise<Result> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: savedSearchId },
    });
    if (!savedSearch || savedSearch.userId !== userId) {
      return { success: false, error: "Saved search not found." };
    }

    await prisma.savedSearch.update({
      where: { id: savedSearchId },
      data: {
        departureDate: departureDate ? new Date(departureDate) : null,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Pause or resume all notifications for the current user.
 * Stored in Clerk publicMetadata alongside subscription tier.
 */
export async function toggleGlobalNotifications(
  paused: boolean
): Promise<Result> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "You must be signed in." };
  }

  try {
    // Update all notification subscriptions
    await prisma.notificationSubscription.updateMany({
      where: { userId },
      data: { isActive: !paused },
    });

    // Store global preference in Clerk metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { notificationsPaused: paused },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
