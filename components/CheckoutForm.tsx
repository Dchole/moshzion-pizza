"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { processCheckout } from "@/app/actions/checkout";
import type { CartItem } from "@/types";
import { Button, SelectButton, Input } from "@/components/ui";
import PaymentIcon from "@mui/icons-material/Payment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloseIcon from "@mui/icons-material/Close";

type PaymentMethod = "credit-card" | "mobile-money" | "cash-on-delivery";

interface CheckoutFormProps {
  items: CartItem[];
  totalPrice: number;
}

export function CheckoutForm({ items, totalPrice }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderItems, setOrderItems] = useState<CartItem[]>(items);

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await processCheckout(formData);

      if (result.success) {
        router.push("/order-confirmation");
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Left Column - Products & Payment */}
      <div className="space-y-6 bg-white/30 rounded-lg p-4 lg:p-6 border border-brown-dark/5">
        {/* Order Items - Mobile (Collapsible) */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full flex items-center justify-between bg-white/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl text-brown-dark">
                Order Items
              </h2>
              <span className="text-sm text-gray-600 font-open-sans">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-brown-dark font-display text-xl">
                ${totalPrice.toFixed(2)}
              </span>
              <svg
                className={`w-5 h-5 text-brown-dark transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showOrderSummary ? "max-h-500 mt-4" : "max-h-0"
            }`}
          >
            <div className="bg-white/50 rounded-lg p-4">
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-xl text-brown-dark">
                            {item.name}
                          </p>
                          <p className="font-display text-base text-brown-dark mt-0.5">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600 font-rubik mt-1">
                            {item.size} · {item.quantity}×
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-brown-dark"
                        >
                          <CloseIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white/50 rounded-lg p-6 border border-brown-dark/5">
          <h2 className="font-open-sans font-semibold text-brown-dark mb-4">
            Payment Method
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <SelectButton
              selected={paymentMethod === "credit-card"}
              onClick={() => setPaymentMethod("credit-card")}
              className="flex flex-col items-center justify-center gap-2 p-4"
            >
              <CreditCardIcon
                sx={{ fontSize: 32 }}
                className="text-brown-dark"
              />
              <span className="text-xs font-medium text-center">
                Credit card
              </span>
            </SelectButton>

            <SelectButton
              selected={paymentMethod === "mobile-money"}
              onClick={() => setPaymentMethod("mobile-money")}
              className="flex flex-col items-center justify-center gap-2 p-4"
            >
              <PhoneAndroidIcon
                sx={{ fontSize: 32 }}
                className="text-brown-dark"
              />
              <span className="text-xs font-medium text-center">
                Mobile money
              </span>
            </SelectButton>

            <SelectButton
              selected={paymentMethod === "cash-on-delivery"}
              onClick={() => setPaymentMethod("cash-on-delivery")}
              className="flex flex-col items-center justify-center gap-2 p-4"
            >
              <LocalShippingIcon
                sx={{ fontSize: 32 }}
                className="text-brown-dark"
              />
              <span className="text-xs font-medium text-center">
                Cash on delivery
              </span>
            </SelectButton>
          </div>

          {/* Card Details Form */}
          {paymentMethod === "credit-card" && (
            <div className="space-y-4">
              <Input
                id="cardNumber"
                name="cardNumber"
                type="text"
                label="Card number"
                required
              />
              <Input
                id="cardName"
                name="cardName"
                type="text"
                label="Card Name"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="expiry"
                  name="expiry"
                  type="text"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  required
                />
                <Input
                  id="cvc"
                  name="cvc"
                  type="text"
                  label="CVC"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          )}

          {/* Mobile Money Form */}
          {paymentMethod === "mobile-money" && (
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label="Phone Number"
              placeholder="0201234567"
              pattern="^0[235][0-9]{8}$"
              maxLength={10}
              required
              helperText="Enter your 10-digit number starting with 02, 03, or 05"
              onInput={e => {
                const input = e.currentTarget;
                input.value = input.value.replace(/\D/g, "").slice(0, 10);
              }}
            />
          )}

          {/* Cash on Delivery Message */}
          {paymentMethod === "cash-on-delivery" && (
            <div className="bg-beige-light border border-brown-dark/10 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-open-sans">
                Pay with cash upon delivery. Please have the exact amount ready.
                Our delivery personnel will confirm your order details before
                accepting payment.
              </p>
            </div>
          )}
        </div>

        {/* Mobile Submit Button */}
        <div className="md:hidden">
          <Button
            type="submit"
            variant="primary"
            color="beige"
            className="w-full"
            disabled={isPending}
            icon={<PaymentIcon sx={{ fontSize: 20 }} />}
            iconPosition="right"
          >
            {isPending ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </div>

      {/* Right Column - Order Summary (Desktop) */}
      <div className="hidden md:block">
        <div className="sticky top-24 bg-beige-light rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-open-sans text-sm text-gray-600">
              Order Summary
            </span>
            <span className="font-display text-2xl text-brown-dark">
              ${orderTotal.toFixed(0)}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {orderItems.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-brown-dark truncate">
                        {item.name}
                      </p>
                      <p className="font-display text-sm text-brown-dark mt-0.5">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 font-rubik mt-1">
                        {item.size} · {item.quantity}×
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="font-display text-base text-brown-dark">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-brown-dark shrink-0"
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-brown-dark/20 pt-4 mb-6">
            <div className="flex justify-between font-display text-xl text-brown-dark">
              <span>Total</span>
              <span>${orderTotal.toFixed(0)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            color="beige"
            className="w-full"
            disabled={isPending}
            icon={<PaymentIcon sx={{ fontSize: 20 }} />}
            iconPosition="right"
          >
            {isPending ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </div>
    </form>
  );
}
