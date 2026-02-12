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

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  totalPrice: number;
  userData: UserData | null;
  hasCreditCard: boolean;
  userId?: string;
}

export function CheckoutForm({
  items,
  totalPrice,
  userData,
  hasCreditCard,
  userId
}: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultPaymentMethod: PaymentMethod = hasCreditCard
    ? "credit-card"
    : userData?.phone
      ? "mobile-money"
      : "credit-card";

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(defaultPaymentMethod);
  const [orderItems, setOrderItems] = useState<CartItem[]>(items);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [contactInfo, setContactInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}`.trim() : "",
    phone: userData?.phone || "",
    address: userData?.address || ""
  });

  const [originalData] = useState(userData);

  const deliveryFee = 5.0;
  const taxRate = 0.1;
  const tax = totalPrice * taxRate;
  const orderTotal = totalPrice + deliveryFee + tax;

  const handleContinueToPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("guestName") as string;
    const phone = formData.get("guestPhone") as string;
    const address = formData.get("guestAddress") as string;

    if (!name || !phone || !address) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^0[235]\d{8}$/.test(phone)) {
      setError(
        "Please enter a valid phone number (10 digits starting with 02, 03, or 05)"
      );
      return;
    }

    setContactInfo({ name, phone, address });
    setError(null);
    setCurrentStep(2);
  };

  const handleBackToContact = () => {
    setCurrentStep(1);
    setError(null);
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      const result = await processCheckout(formData);
      console.log("Checkout result:", result);

      if (result.success && result.orderId) {
        if (userId && originalData) {
          const currentName =
            `${originalData.firstName} ${originalData.lastName}`.trim();
          const hasNameChanged = contactInfo.name !== currentName;
          const hasPhoneChanged = contactInfo.phone !== originalData.phone;
          const hasAddressChanged =
            contactInfo.address !== originalData.address;

          if (hasNameChanged || hasPhoneChanged || hasAddressChanged) {
            const shouldUpdate = window.confirm(
              "Your contact information has changed. Would you like to save these changes to your account?"
            );

            if (shouldUpdate) {
              const { updateUserCheckoutData } =
                await import("@/lib/auth-actions");
              await updateUserCheckoutData({
                name: contactInfo.name,
                phone: contactInfo.phone,
                address: contactInfo.address
              });
            }
          }
        }

        window.dispatchEvent(new Event("cart-updated"));

        router.push(`/order-confirmation?orderId=${result.orderId}`);
      } else {
        setError(result.message || "Checkout failed. Please try again.");
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <>
      {currentStep === 1 ? (
        <form
          onSubmit={handleContinueToPayment}
          className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        >
          <div className="space-y-6 rounded-lg p-4 lg:p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-open-sans">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 border border-brown-dark/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-open-sans font-semibold text-brown-dark">
                  Contact & Delivery Information
                </h2>
                <span className="text-xs font-open-sans text-gray-500">
                  Step 1 of 2
                </span>
              </div>

              <div className="space-y-4">
                <Input
                  id="guestName"
                  name="guestName"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  defaultValue={contactInfo.name}
                  required
                />
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  type="tel"
                  label="Phone Number"
                  placeholder="0201234567"
                  pattern="^0[235][0-9]{8}$"
                  maxLength={10}
                  defaultValue={contactInfo.phone}
                  required
                  helperText="Enter your 10-digit number"
                  onInput={e => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/\\D/g, "").slice(0, 10);
                  }}
                />
                <Input
                  id="guestAddress"
                  name="guestAddress"
                  type="text"
                  label="Delivery Address"
                  placeholder="123 Main Street, Accra"
                  defaultValue={contactInfo.address}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              color="beige"
              className="w-full"
            >
              Continue to Payment
            </Button>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-24 bg-white rounded-lg p-6 border border-brown-dark/10">
              <h3 className="font-open-sans font-semibold text-brown-dark mb-4">
                Order Summary
              </h3>

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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brown-dark/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-brown-dark/20 pt-2 mt-2">
                  <div className="flex justify-between font-display text-xl text-brown-dark">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form
          action={handleSubmit}
          className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        >
          <input type="hidden" name="guestName" value={contactInfo.name} />
          <input type="hidden" name="guestPhone" value={contactInfo.phone} />
          <input
            type="hidden"
            name="guestAddress"
            value={contactInfo.address}
          />
          <input type="hidden" name="paymentMethod" value={paymentMethod} />

          <div className="space-y-6 rounded-lg p-4 lg:p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-open-sans">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-4 border border-brown-dark/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-open-sans font-medium text-brown-dark text-sm">
                  Delivery Details
                </h3>
                <button
                  type="button"
                  onClick={handleBackToContact}
                  className="text-sm text-red-600 hover:text-red-700 font-open-sans"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-700 font-open-sans">
                <p>
                  <strong>{contactInfo.name}</strong>
                </p>
                <p>{contactInfo.phone}</p>
                <p>{contactInfo.address}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-brown-dark/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-open-sans font-semibold text-brown-dark">
                  Payment Method
                </h2>
                <span className="text-xs font-open-sans text-gray-500">
                  Step 2 of 2
                </span>
              </div>

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

              {paymentMethod === "mobile-money" && (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Mobile Money Number"
                  placeholder="0201234567"
                  pattern="^0[235][0-9]{8}$"
                  maxLength={10}
                  defaultValue={contactInfo.phone}
                  required
                  helperText="Enter the phone number to charge for this order"
                  onInput={e => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/\D/g, "").slice(0, 10);
                  }}
                />
              )}

              {paymentMethod === "cash-on-delivery" && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-open-sans">
                    Pay with cash upon delivery. Please have the exact amount
                    ready. Our delivery personnel will confirm your order
                    details before accepting payment.
                  </p>
                </div>
              )}
            </div>

            <div className="md:hidden space-y-3">
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
              <button
                type="button"
                onClick={handleBackToContact}
                className="w-full py-3 text-sm font-open-sans text-gray-600 hover:text-brown-dark"
              >
                ← Back to Contact Info
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-24 bg-white rounded-lg p-6 border border-brown-dark/10">
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

              <div className="border-t border-brown-dark/20 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-open-sans text-gray-700">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-brown-dark/20 pt-2 mt-2">
                  <div className="flex justify-between font-display text-xl text-brown-dark">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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
                <button
                  type="button"
                  onClick={handleBackToContact}
                  className="w-full py-3 text-sm font-open-sans text-gray-600 hover:text-brown-dark"
                >
                  ← Back to Contact Info
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
