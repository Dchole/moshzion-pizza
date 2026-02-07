import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { phoneSchema } from "@/lib/schemas/auth";
import { z } from "zod";
import prisma from "@/lib/db";

interface UserData {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Validate user by phone number
 * OTP verification happens in server actions before calling signIn
 * This just confirms the user exists
 */
async function validateUser(phone: string): Promise<UserData | null> {
  try {
    // Validate phone format
    phoneSchema.parse(phone);

    // Query database for user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        firstName: true,
        lastName: true,
        isPhoneVerified: true
      }
    });

    if (!user) {
      return null;
    }

    // Return user data
    return {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined
    };
  } catch (error) {
    // Invalid input format
    if (error instanceof z.ZodError) {
      return null;
    }
    console.error("Validation error:", error);
    throw error;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Phone (OTP Verified)",
      credentials: {
        phone: { label: "Phone", type: "tel" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          return null;
        }

        const user = await validateUser(credentials.phone as string);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          phone: user.phone,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.phone,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    })
  ],
  pages: {
    signIn: "/account"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
