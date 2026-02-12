"use server";

import { z } from "zod";
import { clearCart, getCart } from "./cart";
import { createOrder, updateOrderPaymentStatus } from "./orders";
import { UI_TIMING } from "@/lib/constants";
import { calculateOrderTotals, VALIDATION } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth";
import { getUserAddresses } from "@/lib/address-actions";
import { initiatePayment, formatPhoneForHubtel } from "@/lib/hubtel-payment";
import { env } from "@/lib/env";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

const checkoutSchema = z
  .object({
    paymentMethod: z.enum(["credit-card", "mobile-money", "cash-on-delivery"], {
      message: "Please select a payment method"
    }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    phoneNumber: z.string().optional(),
    addressId: z.string().optional(),
    // Guest checkout fields
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    guestAddress: z.string().optional()
  })
  .refine(
    data => {
      if (data.paymentMethod === "credit-card") {
        return (
          data.cardNumber &&
          data.cardName &&
          data.expiry &&
          data.cvc &&
          /^\d{16}$/.test(data.cardNumber.replace(/\s/g, "")) &&
          VALIDATION.expiryFormat.test(data.expiry) &&
          /^\d{3,4}$/.test(data.cvc) &&
          data.cardName.trim().length > 0
        );
      }
      if (data.paymentMethod === "mobile-money") {
        return data.phoneNumber && VALIDATION.phoneRegex.test(data.phoneNumber);
      }
      return true;
    },
    {
      message: "Invalid payment details",
      path: ["cardNumber"]
    }
  );

export async function processCheckout(formData: FormData) {
  try {
    const rawData = {
      paymentMethod: formData.get("paymentMethod") || undefined,
      cardNumber: formData.get("cardNumber") || undefined,
      cardName: formData.get("cardName") || undefined,
      expiry: formData.get("expiry") || undefined,
      cvc: formData.get("cvc") || undefined,
      phoneNumber: formData.get("phoneNumber") || undefined,
      addressId: formData.get("addressId") || undefined,
      guestName: formData.get("guestName") || undefined,
      guestPhone: formData.get("guestPhone") || undefined,
      guestAddress: formData.get("guestAddress") || undefined
    };

    const validation = checkoutSchema.safeParse(rawData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: "Please check your payment details"
      };
    }

    // Get cart items
    const cart = await getCart();
    if (cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty"
      };
    }

    // Get current user
    const user = await getCurrentUser();

    // Calculate order totals using centralized config
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { deliveryFee, tax, total } = calculateOrderTotals(subtotal);

    // Get address for authenticated users
    let addressId = validation.data.addressId;
    if (user && !addressId) {
      const addresses = await getUserAddresses();
      const defaultAddress = addresses.find(addr => addr.isDefault);
      addressId = defaultAddress?.id;
    }

    // Simulate payment processing delay
    await new Promise(resolve =>
      setTimeout(resolve, UI_TIMING.checkoutProcessingDelay)
    );

    // Create the order
    const orderResult = await createOrder({
      items: cart.items,
      subtotal,
      deliveryFee,
      tax,
      total,
      addressId,
      paymentMethodType: validation.data.paymentMethod,
      mobileMoneyPhone: validation.data.phoneNumber,
      guestName: validation.data.guestName,
      guestPhone: validation.data.guestPhone,
      guestAddress: validation.data.guestAddress
    });

    if (!orderResult.success || !orderResult.orderId) {
      return {
        success: false,
        message: orderResult.error || "Failed to create order"
      };
    }

    const orderId = orderResult.orderId;

    // Auto-save address for authenticated users if they used guest address
    if (user && validation.data.guestAddress && !addressId) {
      try {
        // Check if user has any default address
        const hasDefaultAddress = await prisma.address.findFirst({
          where: {
            userId: user.id,
            isDefault: true
          }
        });

        // Save the address
        await prisma.address.create({
          data: {
            userId: user.id,
            label: "Delivery Address",
            street: validation.data.guestAddress,
            city: "Accra", // Default city
            country: "Ghana",
            isDefault: !hasDefaultAddress // Set as default if no default exists
          }
        });
      } catch (error) {
        // Log error but don't fail the order
        logger.error("Failed to save delivery address", error, {
          userId: user.id
        });
      }
    }

    // Process payment based on payment method
    if (
      validation.data.paymentMethod === "mobile-money" &&
      validation.data.phoneNumber
    ) {
      try {
        // Get customer details
        const customerName = validation.data.guestName || "Customer";

        const customerPhone = formatPhoneForHubtel(validation.data.phoneNumber);

        // Initiate Hubtel payment
        const paymentResult = await initiatePayment({
          customerName,
          customerMobileNumber: customerPhone,
          amount: total,
          primaryCallbackUrl: `${env.NEXTAUTH_URL}/api/payments/hubtel/callback`,
          description: `Pizza Order #${orderId.slice(0, 8)}`,
          clientReference: orderId
        });

        if (paymentResult.status === "Success") {
          // Payment initiated successfully
          // User will get mobile money prompt on their phone
          logger.payment("initiate", orderId, total, {
            method: "mobile-money",
            phone: customerPhone
          });
        }
      } catch (paymentError) {
        logger.error("Hubtel payment initiation failed", paymentError, {
          orderId
        });
        // Continue even if payment initiation fails - order is already created
      }
    } else if (validation.data.paymentMethod === "credit-card") {
      // For credit cards, mark as paid immediately (in production, integrate real payment gateway)
      await updateOrderPaymentStatus(orderId, "PAID");
    }
    // Cash on delivery stays as PENDING

    // Clear cart after successful order
    await clearCart();

    return {
      success: true,
      orderId,
      paymentMethod: validation.data.paymentMethod,
      message: "Order placed successfully!",
      // Include guest info for post-order save flow
      guestInfo: !user
        ? {
            name: validation.data.guestName,
            phone: validation.data.guestPhone,
            address: validation.data.guestAddress
          }
        : undefined
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again."
    };
  }
}
