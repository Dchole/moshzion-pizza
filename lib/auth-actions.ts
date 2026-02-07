"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import type { SignInInput, SignUpInput } from "@/lib/schemas/auth";
import { z } from "zod";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

export async function authenticateWithCredentials(
  data: SignInInput
): Promise<ActionResult> {
  try {
    // Validate input on server side
    const validatedData = signInSchema.parse(data);

    await signIn("credentials", {
      phone: validatedData.phone,
      password: validatedData.password,
      redirect: false
    });

    return { success: true };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach(err => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        error: "Validation failed",
        errors: fieldErrors
      };
    }

    // Handle auth errors
    if (error instanceof AuthError) {
      return {
        success: false,
        error: "Invalid phone number or password"
      };
    }

    return {
      success: false,
      error: "An error occurred during sign in"
    };
  }
}

export async function authenticateWithProvider(
  provider: "google" | "facebook"
) {
  await signIn(provider, { redirectTo: "/account" });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

/**
 * Validate sign up data (for future implementation)
 * This validates the data structure but doesn't create the user yet
 */
export async function validateSignUpData(
  data: SignUpInput
): Promise<ActionResult> {
  try {
    signUpSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach(err => {
        const path = err.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });
      return {
        success: false,
        error: "Validation failed",
        errors: fieldErrors
      };
    }
    return {
      success: false,
      error: "An error occurred during validation"
    };
  }
}

/**
 * Register a new user
 */
export async function registerUser(data: SignUpInput): Promise<ActionResult> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Registration failed",
        errors: result.errors
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred during registration"
    };
  }
}
