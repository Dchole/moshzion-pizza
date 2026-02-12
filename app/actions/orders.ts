"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { CartItem, OrderItem } from "@/types";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";

export interface CreateOrderInput {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  addressId?: string;
  paymentMethodType: string;
  mobileMoneyPhone?: string;
  guestName?: string;
  guestPhone?: string;
  guestAddress?: string;
}

/**
 * Create a new order (for both authenticated and guest users)
 */
export async function createOrder(input: CreateOrderInput) {
  try {
    const user = await getCurrentUser();

    // Validate input
    if (!input.items || input.items.length === 0) {
      return {
        success: false,
        error: "Cart is empty"
      };
    }

    // For guest orders, require guest info
    if (
      !user &&
      (!input.guestName || !input.guestPhone || !input.guestAddress)
    ) {
      return {
        success: false,
        error: "Guest information is required"
      };
    }

    // Convert CartItem[] to OrderItem[] format
    const orderItems: OrderItem[] = input.items.map(item => ({
      id: item.id,
      pizzaId: item.pizzaId,
      name: item.name,
      price: item.price,
      size: item.size,
      toppings: item.toppings,
      quantity: item.quantity,
      image: item.image
    }));

    // Determine payment status based on payment method
    const paymentStatus =
      input.paymentMethodType === "cash-on-delivery" ? "PENDING" : "PENDING";

    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        addressId: input.addressId,
        items: orderItems as unknown as Prisma.InputJsonValue,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        tax: input.tax,
        total: input.total,
        paymentMethod: input.paymentMethodType, // Save payment method
        guestName: input.guestName,
        guestPhone: input.guestPhone,
        guestAddress: input.guestAddress,
        status: "PENDING",
        paymentStatus
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        address: true
      }
    });

    // Auto-save mobile money payment method for authenticated users
    if (
      user &&
      input.paymentMethodType === "mobile-money" &&
      input.mobileMoneyPhone
    ) {
      try {
        // Detect provider from phone number prefix (Ghana)
        const phonePrefix = input.mobileMoneyPhone.substring(0, 3);
        let provider = "Mobile Money";

        if (["024", "054", "055", "059"].includes(phonePrefix)) {
          provider = "MTN";
        } else if (["020", "050"].includes(phonePrefix)) {
          provider = "Vodafone";
        } else if (["027", "057", "026", "056"].includes(phonePrefix)) {
          provider = "AirtelTigo";
        }

        // Check if this payment method already exists
        const existingMethod = await prisma.paymentMethod.findFirst({
          where: {
            userId: user.id,
            type: "Mobile Money",
            fullPhone: input.mobileMoneyPhone
          }
        });

        // Only create if it doesn't exist
        if (!existingMethod) {
          // Check if user has any default payment method
          const hasDefault = await prisma.paymentMethod.findFirst({
            where: {
              userId: user.id,
              isDefault: true
            }
          });

          await prisma.paymentMethod.create({
            data: {
              userId: user.id,
              type: "Mobile Money",
              provider,
              last4: input.mobileMoneyPhone.slice(-4),
              fullPhone: input.mobileMoneyPhone,
              isDefault: !hasDefault // Set as default if no default exists
            }
          });
        }
      } catch (error) {
        // Log error but don't fail the order
        logger.error("Failed to save mobile money payment method", error);
      }
    }

    revalidatePath("/orders");
    revalidatePath("/account");

    logger.order("created", order.id, {
      userId: order.userId || "guest",
      total: order.total,
      itemCount: input.items.length
    });

    return {
      success: true,
      orderId: order.id,
      order
    };
  } catch (error) {
    logger.error("Error creating order", error);
    return {
      success: false,
      error: "Failed to create order. Please try again."
    };
  }
}

/**
 * Update order payment status (called after successful payment)
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "PAID" | "FAILED"
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status: paymentStatus === "PAID" ? "CONFIRMED" : "PENDING"
      }
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      order
    };
  } catch (error) {
    logger.error("Error updating payment status", error, { orderId });
    return {
      success: false,
      error: "Failed to update payment status"
    };
  }
}

/**
 * Get all orders for the current authenticated user
 */
export async function getUserOrders() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
        orders: []
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        address: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      success: true,
      orders
    };
  } catch (error) {
    logger.error("Error fetching orders", error);
    return {
      success: false,
      error: "Failed to fetch orders",
      orders: []
    };
  }
}

/**
 * Get a single order by ID
 * Authorization is enforced at the database query level
 */
export async function getOrderById(orderId: string) {
  try {
    const user = await getCurrentUser();

    // Build query with authorization constraints
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          // User owns this order
          { userId: user?.id },
          // Guest order (allow access only if no userId set)
          { userId: null }
        ]
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        address: true
      }
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found or you don't have permission to view it"
      };
    }

    return {
      success: true,
      order
    };
  } catch (error) {
    logger.error("Error fetching order", error, { orderId });
    return {
      success: false,
      error: "Failed to fetch order"
    };
  }
}

/**
 * Cancel an order (only if it's still pending or confirmed)
 */
export async function cancelOrder(orderId: string) {
  try {
    const user = await getCurrentUser();

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found"
      };
    }

    // Check if user owns this order
    if (order.userId !== user?.id) {
      return {
        success: false,
        error: "Unauthorized"
      };
    }

    // Only allow cancellation if order is still pending or confirmed
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return {
        success: false,
        error: "Order cannot be cancelled at this stage"
      };
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status: "CANCELLED"
      }
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    logger.order("cancelled", orderId, { userId: user?.id });

    return {
      success: true,
      order: updatedOrder
    };
  } catch (error) {
    logger.error("Error cancelling order", error, { orderId });
    return {
      success: false,
      error: "Failed to cancel order"
    };
  }
}

/**
 * Link a guest order to a newly created user account
 */
export async function linkOrderToUser(orderId: string, userId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { userId }
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    logger.order("updated", orderId, { linkedUserId: userId });

    return {
      success: true,
      order
    };
  } catch (error) {
    logger.error("Error linking order to user", error, { orderId, userId });
    return {
      success: false,
      error: "Failed to link order"
    };
  }
}
