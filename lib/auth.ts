import { auth } from "@/auth";
import { cache } from "react";
import prisma from "@/lib/db";

/**
 * Get current authenticated user (minimal auth info from JWT)
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

/**
 * Get full user profile (fresh from database)
 * Use this for profile pages to always get latest data
 */
export const getUserProfile = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      phone: true,
      firstName: true,
      lastName: true,
      isPhoneVerified: true,
      phoneVerifiedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
});

export const requireAuth = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
});
