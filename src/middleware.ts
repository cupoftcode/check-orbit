import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAccountRoute = createRouteMatcher(["/account(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isAdminRoute(req)) {
        const { sessionClaims } = await auth.protect();
        const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
        if (role !== "curator" && role !== "admin") {
          return Response.redirect(new URL("/", req.url));
        }
      }

      if (isAccountRoute(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
