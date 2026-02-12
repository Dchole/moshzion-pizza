"use client";

import { useState } from "react";
import { Button, Modal, Alert } from "./ui";
import { Input } from "./ui/Input";
import { addAddress, updateAddress } from "@/lib/address-actions";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null; // If provided, we're editing
  onSuccess?: () => void;
}

export function AddressFormModal({
  isOpen,
  onClose,
  address,
  onSuccess
}: AddressFormModalProps) {
  const [formData, setFormData] = useState({
    label: address?.label || "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "Ghana",
    isDefault: address?.isDefault || false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = address
        ? await updateAddress(address.id, formData)
        : await addAddress(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
        setFormData({
          label: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Ghana",
          isDefault: false
        });
      } else {
        setError(result.error || "Failed to save address");
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
      title={address ? "Edit Address" : "Add New Address"}
      maxWidth="md"
    >
      {error && <Alert variant="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        \
        <div>
          <label className="block text-sm font-medium mb-1">
            Label <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.label}
            onChange={e => setFormData({ ...formData, label: e.target.value })}
            placeholder="e.g., Home, Office, etc."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.street}
            onChange={e => setFormData({ ...formData, street: e.target.value })}
            placeholder="Street address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              State/Region
            </label>
            <Input
              type="text"
              value={formData.state}
              onChange={e =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="State/Region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <Input
              type="text"
              value={formData.zipCode}
              onChange={e =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              placeholder="Zip code"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.country}
            onChange={e =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={e =>
              setFormData({ ...formData, isDefault: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label htmlFor="isDefault" className="text-sm font-medium">
            Set as default address
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
            {loading ? "Saving..." : address ? "Update Address" : "Add Address"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
