import { auth } from "@/auth";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export const requireAuth = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
});
