"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { logger } from "@/lib/logger";

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
 * Cached for the duration of the request to optimize performance
 * @returns Array of user addresses, ordered by default status and creation date
 */
export const getUserAddresses = cache(async () => {
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
    logger.error("Get addresses error", error);
    return [];
  }
});

/**
 * Add a new address for the current user
 * Automatically unsets other defaults if this address is marked as default
 * @param data - Address input data (label, street, city, state, zipCode, country, isDefault)
 * @returns Action result with success status and optional error messages
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

    logger.error("Add address error", error);
    return {
      success: false,
      error: "Failed to add address"
    };
  }
}

/**
 * Update an existing address
 * Verifies ownership before updating, unsets other defaults if this is marked as default
 * @param addressId - ID of the address to update
 * @param data - Updated address data
 * @returns Action result with success status and optional error messages
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

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId }
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return {
        success: false,
        error: "Address not found"
      };
    }

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

    logger.error("Update address error", error);
    return {
      success: false,
      error: "Failed to update address"
    };
  }
}

/**
 * Delete an address
 * Verifies ownership before deletion to ensure users can only delete their own addresses
 * @param addressId - ID of the address to delete
 * @returns Action result with success status and optional error messages
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
    logger.error("Delete address error", error, { addressId });
    return {
      success: false,
      error: "Failed to delete address"
    };
  }
}
