/**
 * Refactored Checkout Form
 * Now uses modular sub-components for better maintainability
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { processCheckout } from "@/app/actions/checkout";
import type { CartItem } from "@/types";
import { Button, ConfirmDialog, Alert } from "@/components/ui";
import PaymentIcon from "@mui/icons-material/Payment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { calculateOrderTotals, VALIDATION } from "@/lib/config";
import { ContactInfoStep } from "@/components/checkout/ContactInfoStep";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    name: userData ? `${userData.firstName} ${userData.lastName}`.trim() : "",
    phone: userData?.phone || "",
    address: userData?.address || ""
  });

  const [originalData] = useState(userData);

  const {
    deliveryFee,
    tax,
    total: orderTotal
  } = calculateOrderTotals(
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

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

    if (!VALIDATION.phoneRegex.test(phone)) {
      setError(VALIDATION.phoneHelp);
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

      if (result.success && result.orderId) {
        if (userId && originalData) {
          const currentName =
            `${originalData.firstName} ${originalData.lastName}`.trim();
          const hasNameChanged = contactInfo.name !== currentName;
          const hasPhoneChanged = contactInfo.phone !== originalData.phone;
          const hasAddressChanged =
            contactInfo.address !== originalData.address;

          if (hasNameChanged || hasPhoneChanged || hasAddressChanged) {
            setPendingOrderId(result.orderId);
            setShowSaveDialog(true);
            return;
          }
        }

        window.dispatchEvent(new Event("cart-updated"));
        router.push(`/order-confirmation?orderId=${result.orderId}`);
      } else {
        setError(result.message || "Checkout failed. Please try again.");
      }
    });
  };

  const handleSaveChanges = async () => {
    const { updateUserCheckoutData } = await import("@/lib/auth-actions");
    await updateUserCheckoutData({
      name: contactInfo.name,
      phone: contactInfo.phone,
      address: contactInfo.address
    });

    if (pendingOrderId) {
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/order-confirmation?orderId=${pendingOrderId}`);
    }
  };

  const handleSkipSave = () => {
    if (pendingOrderId) {
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/order-confirmation?orderId=${pendingOrderId}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Step 1: Contact Information
  const step1Content = (
    <form
      onSubmit={handleContinueToPayment}
      className="grid gap-6 lg:grid-cols-[2fr_1fr]"
    >
      <ContactInfoStep
        contactInfo={contactInfo}
        error={error}
        isPending={isPending}
      />

      <OrderSummary
        items={orderItems}
        subtotal={orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )}
        deliveryFee={deliveryFee}
        tax={tax}
        total={orderTotal}
        onRemoveItem={handleRemoveItem}
        showRemoveButtons
      />

      {/* Continue Button */}
      <div className="lg:col-span-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          color="beige"
          disabled={isPending}
          icon={<PaymentIcon sx={{ fontSize: 20 }} />}
          iconPosition="right"
          className="w-full sm:w-auto"
        >
          Continue to Payment
        </Button>
      </div>
    </form>
  );

  // Step 2: Payment
  const step2Content = (
    <form action={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Hidden contact info fields */}
      <input type="hidden" name="guestName" value={contactInfo.name} />
      <input type="hidden" name="guestPhone" value={contactInfo.phone} />
      <input type="hidden" name="guestAddress" value={contactInfo.address} />

      <div className="space-y-6">
        {error && <Alert variant="error" message={error} />}

        <PaymentMethodStep
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          isPending={isPending}
          hasCreditCard={hasCreditCard}
          defaultPhone={contactInfo.phone}
        />
      </div>

      <OrderSummary
        items={orderItems}
        subtotal={orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )}
        deliveryFee={deliveryFee}
        tax={tax}
        total={orderTotal}
      />

      {/* Action Buttons */}
      <div className="lg:col-span-2 flex gap-4 justify-between">
        <Button
          type="button"
          variant="outline"
          color="brown"
          onClick={handleBackToContact}
          disabled={isPending}
          icon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
          iconPosition="left"
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="primary"
          color="beige"
          disabled={isPending}
          icon={<PaymentIcon sx={{ fontSize: 20 }} />}
          iconPosition="right"
        >
          {isPending ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
  return (
    <>
      {currentStep === 1 ? step1Content : step2Content}

      <ConfirmDialog
        open={showSaveDialog}
        onClose={handleSkipSave}
        onConfirm={handleSaveChanges}
        title="Save Contact Information?"
        message="Your contact information has changed. Would you like to save these changes to your account for future orders?"
        confirmText="Save Changes"
        cancelText="Skip"
        variant="info"
        isLoading={isPending}
      />
    </>
  );
}
