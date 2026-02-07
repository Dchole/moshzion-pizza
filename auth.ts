import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "@/lib/schemas/auth";
import { z } from "zod";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

interface UserData {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
}

async function validateUser(
  phone: string,
  password: string
): Promise<UserData | null> {
  try {
    // Validate input format
    signInSchema.parse({ phone, password });

    // Query database for user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        password: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    return {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }),
    Credentials({
      name: "Phone & Password",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const user = await validateUser(
          credentials.phone as string,
          credentials.password as string
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          phone: user.phone,
          name: `${user.firstName} ${user.lastName}`,
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
