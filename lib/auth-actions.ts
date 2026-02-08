"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  sendOTPSchema,
  verifyOTPSchema,
  updateProfileSchema
} from "@/lib/schemas/auth";
import type {
  SendOTPInput,
  VerifyOTPInput,
  UpdateProfileInput
} from "@/lib/schemas/auth";
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
    const validatedData = sendOTPSchema.parse(data);
    const { phone } = validatedData;

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.upsert({
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

    await sendOTPVerification(phone, otpCode);

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
    const validatedData = verifyOTPSchema.parse(data);
    const { phone, code } = validatedData;

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

    if (new Date() > user.otpExpiresAt) {
      return {
        success: false,
        error: "Verification code expired. Please request a new one."
      };
    }

    if (user.otpAttempts >= 5) {
      return {
        success: false,
        error: "Too many failed attempts. Please request a new code."
      };
    }

    if (user.otpCode !== code) {
      await prisma.user.update({
        where: { phone },
        data: { otpAttempts: user.otpAttempts + 1 }
      });

      return {
        success: false,
        error: "Invalid verification code. Please try again."
      };
    }

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

    await signIn("credentials", {
      phone,
      redirect: false
    });

    return { success: true, isNewAccount };
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

/**
 * Update user profile (firstName, lastName)
 * Only updates fields that are provided
 */
export async function updateProfile(
  data: UpdateProfileInput
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update your profile"
      };
    }

    const validatedData = updateProfileSchema.parse(data);

    const updateData: { firstName?: string; lastName?: string } = {};
    if (validatedData.firstName !== undefined) {
      updateData.firstName = validatedData.firstName;
    }
    if (validatedData.lastName !== undefined) {
      updateData.lastName = validatedData.lastName;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }

    console.error("Update profile error:", error);
    return {
      success: false,
      error: "An error occurred while updating your profile"
    };
  }
}

/**
 * Send OTP for phone update (stores OTP on current user, not new phone)
 */
export async function sendPhoneUpdateOTP(
  newPhone: string
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be signed in to update your phone number"
      };
    }

    const phoneSchema = z.string().regex(/^(02|03|05)\d{8}$/, {
      message: "Phone number must be 10 digits starting with 02, 03, or 05"
    });
    phoneSchema.parse(newPhone);

    const existingUser = await prisma.user.findUnique({
      where: { phone: newPhone }
    });

    if (existingUser && existingUser.id !== currentUser.id) {
      return {
        success: false,
        error: "This phone number is already in use by another account"
      };
    }

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        otpCode,
        otpExpiresAt,
        otpAttempts: 0
      }
    });

    await sendOTPVerification(newPhone, otpCode);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }

    console.error("Send phone update OTP error:", error);
    return {
      success: false,
      error: "Failed to send verification code. Please try again."
    };
  }
}

/**
 * Update phone number (requires OTP verification)
 * Verifies OTP on current user, then updates phone
 */
export async function updatePhone(data: {
  newPhone: string;
  code: string;
}): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "You must be signed in to update your phone number"
      };
    }

    const { updatePhoneSchema } = await import("@/lib/schemas/auth");
    const validatedData = updatePhoneSchema.parse(data);
    const { newPhone, code } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { phone: newPhone }
    });

    if (existingUser && existingUser.id !== currentUser.id) {
      return {
        success: false,
        error: "This phone number is already in use by another account"
      };
    }

    const userWithOTP = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        otpCode: true,
        otpExpiresAt: true,
        otpAttempts: true
      }
    });

    if (!userWithOTP?.otpCode) {
      return {
        success: false,
        error: "Please request a verification code first"
      };
    }

    if (new Date() > userWithOTP.otpExpiresAt!) {
      return {
        success: false,
        error: "Verification code has expired. Please request a new one"
      };
    }

    if (userWithOTP.otpAttempts >= 5) {
      return {
        success: false,
        error: "Too many attempts. Please request a new code"
      };
    }

    if (userWithOTP.otpCode !== code) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { otpAttempts: { increment: 1 } }
      });

      return {
        success: false,
        error: "Invalid verification code"
      };
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        phone: newPhone,
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0
      }
    });

    await signOut({ redirect: false });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }

    console.error("Update phone error:", error);
    return {
      success: false,
      error: "An error occurred while updating your phone number"
    };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
