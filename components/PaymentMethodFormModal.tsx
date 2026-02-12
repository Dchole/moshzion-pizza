"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Alert } from "./ui";
import { Input } from "./ui/Input";
import { addPaymentMethod, updatePaymentMethod } from "@/lib/payment-actions";
import { detectMobileMoneyProvider, getPhoneLast4 } from "@/lib/utils/phone";

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  last4: string;
  fullPhone?: string | null;
  name?: string | null;
  isDefault: boolean;
}

interface PaymentMethodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: PaymentMethod | null;
  onSuccess?: () => void;
}

export function PaymentMethodFormModal({
  isOpen,
  onClose,
  paymentMethod,
  onSuccess
}: PaymentMethodFormModalProps) {
  const [formData, setFormData] = useState<{
    type: "Mobile Money" | "Card";
    provider: string;
    last4: string;
    fullPhone: string;
    name: string;
    isDefault: boolean;
  }>({
    type: (paymentMethod?.type as "Mobile Money" | "Card") || "Mobile Money",
    provider: paymentMethod?.provider || "",
    last4: paymentMethod?.last4 || "",
    fullPhone: paymentMethod?.fullPhone || "",
    name: paymentMethod?.name || "",
    isDefault: paymentMethod?.isDefault || false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form when paymentMethod prop changes
  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        type: (paymentMethod.type as "Mobile Money" | "Card") || "Mobile Money",
        provider: paymentMethod.provider || "",
        last4: paymentMethod.last4 || "",
        fullPhone: paymentMethod.fullPhone || "",
        name: paymentMethod.name || "",
        isDefault: paymentMethod.isDefault || false
      });
    }
  }, [paymentMethod]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Auto-detect provider for Mobile Money using utility function
    let finalProvider = formData.provider;
    if (formData.type === "Mobile Money" && formData.fullPhone) {
      finalProvider = detectMobileMoneyProvider(formData.fullPhone);
    }

    // Validate last4
    if (formData.last4.length !== 4) {
      setError("Last 4 digits must be exactly 4 characters");
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        provider: finalProvider
      };

      const result = paymentMethod
        ? await updatePaymentMethod(paymentMethod.id, dataToSubmit)
        : await addPaymentMethod(dataToSubmit);

      if (result.success) {
        onSuccess?.();
        onClose();
        // Reset form
        setFormData({
          type: "Mobile Money",
          provider: "",
          last4: "",
          fullPhone: "",
          name: "",
          isDefault: false
        });
      } else {
        setError(result.error || "Failed to save payment method");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
      maxWidth="md"
    >
      {error && <Alert variant="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={e => {
              setFormData({
                ...formData,
                type: e.target.value as "Mobile Money" | "Card",
                provider: "" // Reset provider when type changes
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="Mobile Money">Mobile Money</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {formData.type === "Mobile Money" ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.fullPhone}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                  // Auto-detect provider using utility function
                  const detectedProvider = detectMobileMoneyProvider(value);

                  setFormData({
                    ...formData,
                    fullPhone: value,
                    provider:
                      detectedProvider !== "Mobile Money"
                        ? detectedProvider
                        : "",
                    last4: getPhoneLast4(value)
                  });
                }}
                placeholder="0241234567"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your full mobile money number (10 digits)
                {formData.provider && (
                  <span className="font-medium text-brown-dark ml-1">
                    • {formData.provider} detected
                  </span>
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Network <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.provider}
                onChange={e =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                placeholder="e.g., Visa, Mastercard"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Last 4 digits of card <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.last4}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setFormData({ ...formData, last4: value });
                }}
                placeholder="1234"
                maxLength={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cardholder Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name on card"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefaultPayment"
            checked={formData.isDefault}
            onChange={e =>
              setFormData({ ...formData, isDefault: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label htmlFor="isDefaultPayment" className="text-sm font-medium">
            Set as default payment method
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading
              ? "Saving..."
              : paymentMethod
                ? "Update"
                : "Add Payment Method"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
