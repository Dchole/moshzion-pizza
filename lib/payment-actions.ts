"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

const paymentMethodSchema = z.object({
  type: z.enum(["Mobile Money", "Card"]),
  provider: z.string().min(1, "Provider is required"),
  last4: z.string().length(4, "Must be 4 digits"),
  fullPhone: z.string().optional(),
  name: z.string().optional(),
  isDefault: z.boolean().default(false)
}).refine(
  (data) => {
    // If Mobile Money, fullPhone is required and must match Ghana format
    if (data.type === "Mobile Money") {
      return data.fullPhone && /^(02|03|05)\d{8}$/.test(data.fullPhone);
    }
    return true;
  },
  {
    message: "Valid phone number required for Mobile Money (e.g., 0241234567)",
    path: ["fullPhone"],
  }
);

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;

/**
 * Get all payment methods for the current user
 */
export async function getUserPaymentMethods() {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return [];
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" }
      ]
    });

    return paymentMethods;
  } catch (error) {
    console.error("Get payment methods error:", error);
    return [];
  }
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(
  data: PaymentMethodInput
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to add a payment method"
      };
    }

    const validatedData = paymentMethodSchema.parse(data);

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    await prisma.paymentMethod.create({
      data: {
        ...validatedData,
        userId: user.id
      }
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }

    console.error("Add payment method error:", error);
    return {
      success: false,
      error: "Failed to add payment method"
    };
  }
}

/**
 * Update an existing payment method
 */
export async function updatePaymentMethod(
  paymentMethodId: string,
  data: PaymentMethodInput
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update a payment method"
      };
    }

    const validatedData = paymentMethodSchema.parse(data);

    // Verify ownership
    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });

    if (!existingMethod || existingMethod.userId !== user.id) {
      return {
        success: false,
        error: "Payment method not found"
      };
    }

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: paymentMethodId }
        },
        data: { isDefault: false }
      });
    }

    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: validatedData
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }

    console.error("Update payment method error:", error);
    return {
      success: false,
      error: "Failed to update payment method"
    };
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(
  paymentMethodId: string
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to delete a payment method"
      };
    }

    // Verify ownership
    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });

    if (!existingMethod || existingMethod.userId !== user.id) {
      return {
        success: false,
        error: "Payment method not found"
      };
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("Delete payment method error:", error);
    return {
      success: false,
      error: "Failed to delete payment method"
    };
  }
}
