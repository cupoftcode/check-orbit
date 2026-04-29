import { auth } from "@clerk/nextjs/server";

export type UserRole = "user" | "curator" | "admin";

export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  return (sessionClaims?.publicMetadata as { role?: UserRole })?.role ?? "user";
}

export async function isCurator(): Promise<boolean> {
  const role = await getUserRole();
  return role === "curator" || role === "admin";
}

export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}
