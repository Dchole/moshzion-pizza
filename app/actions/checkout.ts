"use server";

import { z } from "zod";
import { clearCart } from "./cart";

const checkoutSchema = z
  .object({
    paymentMethod: z.enum(["credit-card", "mobile-money", "cash-on-delivery"], {
      message: "Please select a payment method"
    }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    phoneNumber: z.string().optional()
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
          /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry) &&
          /^\d{3,4}$/.test(data.cvc) &&
          data.cardName.trim().length > 0
        );
      }
      if (data.paymentMethod === "mobile-money") {
        return data.phoneNumber && /^\+?[\d\s-()]{10,}$/.test(data.phoneNumber);
      }
      return true;
    },
    {
      message: "Invalid payment details",
      path: ["cardNumber"]
    }
  );

export async function processCheckout(formData: FormData) {
  const rawData = {
    paymentMethod: formData.get("paymentMethod"),
    cardNumber: formData.get("cardNumber"),
    cardName: formData.get("cardName"),
    expiry: formData.get("expiry"),
    cvc: formData.get("cvc"),
    phoneNumber: formData.get("phoneNumber")
  };

  const validation = checkoutSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Please check your payment details"
    };
  }

  await new Promise(resolve => setTimeout(resolve, 1500));

  await clearCart();

  return {
    success: true,
    orderId: crypto.randomUUID(),
    message: "Order placed successfully!"
  };
}
