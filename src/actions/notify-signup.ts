"use server";

import { prisma } from "@/lib/db/prisma";

type Result =
  | { success: true; email: string }
  | { success: false; error: string };

export async function notifySignup(
  medicationSlug: string,
  formData: FormData
): Promise<Result> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return { success: false, error: "Email is required." };
  }

  const trimmed = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await prisma.medicationNotifySignup.upsert({
      where: {
        email_medicationSlug: {
          email: trimmed,
          medicationSlug,
        },
      },
      update: {},
      create: { email: trimmed, medicationSlug },
    });

    return { success: true, email: trimmed };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
