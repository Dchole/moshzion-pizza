"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("Ghana"),
  isDefault: z.boolean().default(false)
});

export type AddressInput = z.infer<typeof addressSchema>;

/**
 * Get all addresses for the current user
 */
export async function getUserAddresses() {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return [];
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });

    return addresses;
  } catch (error) {
    console.error("Get addresses error:", error);
    return [];
  }
}

/**
 * Add a new address
 */
export async function addAddress(data: AddressInput): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to add an address"
      };
    }

    const validatedData = addressSchema.parse(data);

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    await prisma.address.create({
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

    console.error("Add address error:", error);
    return {
      success: false,
      error: "Failed to add address"
    };
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(
  addressId: string,
  data: AddressInput
): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to update an address"
      };
    }

    const validatedData = addressSchema.parse(data);

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return {
        success: false,
        error: "Address not found"
      };
    }

    // If this is set as default, unset other defaults
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: addressId } },
        data: { isDefault: false }
      });
    }

    await prisma.address.update({
      where: { id: addressId },
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

    console.error("Update address error:", error);
    return {
      success: false,
      error: "Failed to update address"
    };
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<ActionResult> {
  try {
    const { getCurrentUser } = await import("@/lib/auth");
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to delete an address"
      };
    }

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return {
        success: false,
        error: "Address not found"
      };
    }

    await prisma.address.delete({
      where: { id: addressId }
    });

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return {
      success: false,
      error: "Failed to delete address"
    };
  }
}
