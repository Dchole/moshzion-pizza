"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

type PaymentMethod = "credit-card" | "mobile-money" | "cash-on-delivery";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    alert("Order placed successfully!");
    router.push("/");
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link href="/store" className="text-[#8B5A2B] hover:underline">
            Go to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-14 z-30 bg-white border-b px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5D3A1A]"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-display text-2xl text-[#5D3A1A]">Checkout</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 hidden md:flex items-center justify-between">
          <h1 className="font-display text-4xl text-[#5D3A1A]">Checkout</h1>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 border-b-2 border-[#5D3A1A] px-4 py-2 text-sm font-medium text-[#5D3A1A]">
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Details
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500">
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Details
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <span className="font-medium">
                  {showOrderSummary ? "Hide" : "Show"} order summary
                </span>
                <svg
                  className={`h-5 w-5 transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showOrderSummary && (
                <div className="mt-4 space-y-3 rounded-lg border p-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">
                          ${item.price} · {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        has-checked:border-[#5D3A1A] $
                        {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors has-checked:border-[#5D3A1A] has-checked:bg-[#FFF5E6]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === "credit-card"}
                    onChange={e =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="h-4 w-4 text-[#5D3A1A]"
                  />
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="font-medium">Credit Card</span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors has-checked:border-[#5D3A1A] has-checked:bg-[#FFF5E6]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile-money"
                    checked={paymentMethod === "mobile-money"}
                    onChange={e =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="h-4 w-4 text-[#5D3A1A]"
                  />
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Mobile Money</span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors has-checked:border-[#5D3A1A] has-checked:bg-[#FFF5E6]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={paymentMethod === "cash-on-delivery"}
                    onChange={e =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="h-4 w-4 text-[#5D3A1A]"
                  />
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Cash on delivery</span>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="rounded-lg border bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Card Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cardName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Card Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      placeholder="John Doe"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Security Code (CVC)
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block lg:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        ${item.price} · {item.size}
                        {item.toppings.length > 0 &&
                          ` · ${item.toppings.length} toppings`}
                      </p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#E5D4C1] px-6 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </div>

          <div className="md:hidden lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#E5D4C1] px-6 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Processing..." : `Buy Now - $${totalPrice}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
