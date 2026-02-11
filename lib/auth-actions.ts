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
import {
  sendOTP as sendHubtelOTP,
  verifyOTP as verifyHubtelOTP,
  resendOTP as resendHubtelOTP
} from "@/lib/sms";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  isNewAccount?: boolean;
}

/**
 * Send OTP to phone number via Hubtel OTP API
 * Creates user record if doesn't exist, stores Hubtel requestId
 */
export async function sendOTP(data: SendOTPInput): Promise<ActionResult> {
  try {
    const validatedData = sendOTPSchema.parse(data);
    const { phone } = validatedData;

    // Send OTP via Hubtel
    const otpResult = await sendHubtelOTP(phone);

    if (!otpResult.success || !otpResult.requestId || !otpResult.prefix) {
      return {
        success: false,
        error: otpResult.error || "Failed to send verification code"
      };
    }

    // Store requestId and prefix in user record
    const requestIdExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.upsert({
      where: { phone },
      update: {
        otpRequestId: otpResult.requestId,
        otpPrefix: otpResult.prefix,
        otpRequestIdExpiresAt: requestIdExpiresAt
      },
      create: {
        phone,
        otpRequestId: otpResult.requestId,
        otpPrefix: otpResult.prefix,
        otpRequestIdExpiresAt: requestIdExpiresAt,
        isPhoneVerified: false
      }
    });

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
 * Verify OTP via Hubtel API and sign in user
 * If verification succeeds, marks phone as verified and signs user in
 */
export async function verifyOTP(data: VerifyOTPInput): Promise<ActionResult> {
  try {
    const validatedData = verifyOTPSchema.parse(data);
    const { phone, code } = validatedData;

    // Get user's stored requestId and prefix
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        otpRequestId: true,
        otpPrefix: true,
        otpRequestIdExpiresAt: true,
        isPhoneVerified: true
      }
    });

    if (
      !user ||
      !user.otpRequestId ||
      !user.otpPrefix ||
      !user.otpRequestIdExpiresAt
    ) {
      return {
        success: false,
        error: "No verification code found. Please request a new one."
      };
    }

    if (new Date() > user.otpRequestIdExpiresAt) {
      return {
        success: false,
        error: "Verification code expired. Please request a new one."
      };
    }

    // Verify OTP via Hubtel
    const verifyResult = await verifyHubtelOTP(
      user.otpRequestId,
      user.otpPrefix,
      code
    );

    if (!verifyResult.success) {
      return {
        success: false,
        error: verifyResult.error || "Failed to verify code"
      };
    }

    if (!verifyResult.verified) {
      return {
        success: false,
        error: "Invalid verification code. Please try again."
      };
    }

    // OTP verified successfully
    const isNewAccount = !user.isPhoneVerified;
    await prisma.user.update({
      where: { phone },
      data: {
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
        otpRequestId: null,
        otpPrefix: null,
        otpRequestIdExpiresAt: null
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
 * Send OTP for phone update via Hubtel (stores requestId on current user)
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

    // Send OTP via Hubtel to new phone number
    const otpResult = await sendHubtelOTP(newPhone);

    if (!otpResult.success || !otpResult.requestId || !otpResult.prefix) {
      return {
        success: false,
        error: otpResult.error || "Failed to send verification code"
      };
    }

    // Store requestId and prefix on current user
    const requestIdExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        otpRequestId: otpResult.requestId,
        otpPrefix: otpResult.prefix,
        otpRequestIdExpiresAt: requestIdExpiresAt
      }
    });

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
 * Update phone number (requires Hubtel OTP verification)
 * Verifies OTP via Hubtel, then updates phone
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

    // Get stored requestId and prefix
    const userWithRequestId = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        otpRequestId: true,
        otpPrefix: true,
        otpRequestIdExpiresAt: true
      }
    });

    if (!userWithRequestId?.otpRequestId || !userWithRequestId?.otpPrefix) {
      return {
        success: false,
        error: "Please request a verification code first"
      };
    }

    if (new Date() > userWithRequestId.otpRequestIdExpiresAt!) {
      return {
        success: false,
        error: "Verification code has expired. Please request a new one"
      };
    }

    // Verify OTP via Hubtel
    const verifyResult = await verifyHubtelOTP(
      userWithRequestId.otpRequestId,
      userWithRequestId.otpPrefix,
      code
    );

    if (!verifyResult.success) {
      return {
        success: false,
        error: verifyResult.error || "Failed to verify code"
      };
    }

    if (!verifyResult.verified) {
      return {
        success: false,
        error: "Invalid verification code"
      };
    }

    // Update phone number
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        phone: newPhone,
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
        otpRequestId: null,
        otpPrefix: null,
        otpRequestIdExpiresAt: null
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

/**
 * Resend OTP to phone number
 * Reuses existing requestId to resend the same OTP
 */
export async function resendOTP(data: SendOTPInput): Promise<ActionResult> {
  try {
    const validatedData = sendOTPSchema.parse(data);
    const { phone } = validatedData;

    // Get existing requestId
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        otpRequestId: true,
        otpRequestIdExpiresAt: true
      }
    });

    if (!user?.otpRequestId) {
      return {
        success: false,
        error: "No previous verification code found. Please request a new one."
      };
    }

    // Resend via Hubtel
    const resendResult = await resendHubtelOTP(user.otpRequestId);

    if (
      !resendResult.success ||
      !resendResult.requestId ||
      !resendResult.prefix
    ) {
      return {
        success: false,
        error: resendResult.error || "Failed to resend verification code"
      };
    }

    // Update expiration time and prefix (in case it changed)
    const requestIdExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { phone },
      data: {
        otpRequestId: resendResult.requestId,
        otpPrefix: resendResult.prefix,
        otpRequestIdExpiresAt: requestIdExpiresAt
      }
    });

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

    console.error("Resend OTP error:", error);
    return {
      success: false,
      error: "Failed to resend verification code. Please try again."
    };
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

/**
 * Update user data from checkout
 * Parses full name, updates user profile, and updates/creates default address
 */
export async function updateUserCheckoutData(data: {
  name: string;
  phone: string;
  address: string;
}): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update your profile"
      };
    }

    // Parse name into firstName and lastName
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Update user profile
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName
      }
    });

    // Get user's default address
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        isDefault: true
      }
    });

    // Parse address (assuming format: "street, city, state")
    const addressParts = data.address.split(",").map(part => part.trim());
    const street = addressParts[0] || data.address;
    const city = addressParts[1] || "";
    const state = addressParts[2] || "";

    if (defaultAddress) {
      // Update existing default address
      await prisma.address.update({
        where: { id: defaultAddress.id },
        data: {
          street,
          city,
          state
        }
      });
    } else {
      // Create new default address
      await prisma.address.create({
        data: {
          userId: user.id,
          label: "Home",
          street,
          city,
          state,
          isDefault: true
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Update checkout data error:", error);
    return {
      success: false,
      error: "Failed to update your information"
    };
  }
}
