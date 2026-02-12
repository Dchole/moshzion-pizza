/**
 * Payment Method Selection Component
 * Allows users to choose and configure payment method
 */

import { SelectButton, Input } from "@/components/ui";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

type PaymentMethod = "credit-card" | "mobile-money" | "cash-on-delivery";

interface PaymentMethodStepProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  isPending: boolean;
  hasCreditCard: boolean;
  defaultPhone?: string;
}

export function PaymentMethodStep({
  paymentMethod,
  onPaymentMethodChange,
  isPending,
  defaultPhone
}: PaymentMethodStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-brown-dark">Payment Method</h2>

      {/* Payment Method Selection */}
      <div className="grid gap-3">
        <SelectButton
          selected={paymentMethod === "credit-card"}
          onClick={() => onPaymentMethodChange("credit-card")}
        >
          <div className="flex items-center gap-3">
            <CreditCardIcon sx={{ fontSize: 24 }} />
            <span>Credit/Debit Card</span>
          </div>
        </SelectButton>

        <SelectButton
          selected={paymentMethod === "mobile-money"}
          onClick={() => onPaymentMethodChange("mobile-money")}
        >
          <div className="flex items-center gap-3">
            <PhoneAndroidIcon sx={{ fontSize: 24 }} />
            <span>Mobile Money</span>
          </div>
        </SelectButton>

        <SelectButton
          selected={paymentMethod === "cash-on-delivery"}
          onClick={() => onPaymentMethodChange("cash-on-delivery")}
        >
          <div className="flex items-center gap-3">
            <LocalShippingIcon sx={{ fontSize: 24 }} />
            <span>Cash on Delivery</span>
          </div>
        </SelectButton>
      </div>

      {/* Payment Input Fields */}
      {paymentMethod === "credit-card" && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-brown-dark mb-2"
            >
              Card Number *
            </label>
            <Input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              disabled={isPending}
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-brown-dark mb-2"
            >
              Cardholder Name *
            </label>
            <Input
              type="text"
              id="cardName"
              name="cardName"
              required
              placeholder="John Doe"
              disabled={isPending}
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-brown-dark mb-2"
              >
                Expiry (MM/YY) *
              </label>
              <Input
                type="text"
                id="expiry"
                name="expiry"
                required
                placeholder="12/25"
                maxLength={5}
                disabled={isPending}
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-brown-dark mb-2"
              >
                CVC *
              </label>
              <Input
                type="text"
                id="cvc"
                name="cvc"
                required
                placeholder="123"
                maxLength={4}
                disabled={isPending}
                aria-required="true"
                aria-describedby="cvc-help"
              />
              <p id="cvc-help" className="text-xs text-gray-600 mt-1">
                3-4 digits on back of card
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "mobile-money" && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-brown-dark mb-2"
            >
              Mobile Money Number *
            </label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              defaultValue={defaultPhone}
              placeholder="0241234567"
              pattern="0[235]\d{8}"
              disabled={isPending}
              aria-required="true"
              aria-describedby="momo-help"
            />
            <p id="momo-help" className="text-xs text-gray-600 mt-1">
              MTN, Vodafone, or AirtelTigo number
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "cash-on-delivery" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You&apos;ll pay with cash when your order is delivered. Please have
            the exact amount ready.
          </p>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </div>
  );
}
