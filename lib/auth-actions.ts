"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { sendOTPSchema, verifyOTPSchema } from "@/lib/schemas/auth";
import type { SendOTPInput, VerifyOTPInput } from "@/lib/schemas/auth";
import { z } from "zod";
import prisma from "@/lib/db";
import { sendOTPVerification } from "@/lib/sms";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  isNewAccount?: boolean;
}

/**
 * Generate a random 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to phone number
 * Creates user record if doesn't exist (with OTP stored)
 * Updates existing user with new OTP
 */
export async function sendOTP(data: SendOTPInput): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = sendOTPSchema.parse(data);
    const { phone } = validatedData;

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    const user = await prisma.user.upsert({
      where: { phone },
      update: {
        otpCode,
        otpExpiresAt,
        otpAttempts: 0
      },
      create: {
        phone,
        otpCode,
        otpExpiresAt,
        otpAttempts: 0,
        isPhoneVerified: false
      }
    });

    // Send OTP via SMS
    await sendOTPVerification(phone, otpCode);

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

    console.error("Send OTP error:", error);
    return {
      success: false,
      error: "Failed to send verification code. Please try again."
    };
  }
}

/**
 * Verify OTP and sign in user
 * If verification succeeds, marks phone as verified and signs user in
 */
export async function verifyOTP(data: VerifyOTPInput): Promise<ActionResult> {
  try {
    // Validate input
    const validatedData = verifyOTPSchema.parse(data);
    const { phone, code } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        otpCode: true,
        otpExpiresAt: true,
        otpAttempts: true,
        isPhoneVerified: true
      }
    });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return {
        success: false,
        error: "No verification code found. Please request a new one."
      };
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiresAt) {
      return {
        success: false,
        error: "Verification code expired. Please request a new one."
      };
    }

    // Check rate limiting (max 5 attempts)
    if (user.otpAttempts >= 5) {
      return {
        success: false,
        error: "Too many failed attempts. Please request a new code."
      };
    }

    // Verify code
    if (user.otpCode !== code) {
      // Increment attempts
      await prisma.user.update({
        where: { phone },
        data: { otpAttempts: user.otpAttempts + 1 }
      });

      return {
        success: false,
        error: "Invalid verification code. Please try again."
      };
    }

    // Success! Mark phone as verified and clear OTP
    const isNewAccount = !user.isPhoneVerified;
    await prisma.user.update({
      where: { phone },
      data: {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0
      }
    });

    // Sign in user
    await signIn("credentials", {
      phone,
      redirect: false
    });

    return { success: true, isNewAccount };
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
        error: "Authentication failed. Please try again."
      };
    }

    console.error("Verify OTP error:", error);
    return {
      success: false,
      error: "An error occurred during verification"
    };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
