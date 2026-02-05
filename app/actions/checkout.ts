"use server";

import { clearCart } from "./cart";

export async function processCheckout(formData: FormData) {
  // Extract form data
  const paymentMethod = formData.get("paymentMethod");
  const cardNumber = formData.get("cardNumber");
  const cardName = formData.get("cardName");
  const expiry = formData.get("expiry");
  const cvc = formData.get("cvc");

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // TODO: Implement actual payment processing logic here
  // For now, we'll just clear the cart and return success

  // Clear the cart after successful checkout
  await clearCart();

  return {
    success: true,
    orderId: `ORD-${Date.now()}`,
    message: "Order placed successfully!"
  };
}
