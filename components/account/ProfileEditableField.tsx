"use client";

import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IconButton, Input, Button } from "@/components/ui";
import {
  sendPhoneUpdateOTP,
  updateProfile,
  updatePhone
} from "@/lib/auth-actions";

interface ProfileEditableFieldProps {
  label: string;
  field: "firstName" | "lastName" | "phone";
  value: string;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSuccess: () => void;
  startTransition: (callback: () => void) => void;
}

export function ProfileEditableField({
  label,
  field,
  value,
  isEditing,
  isPending,
  onEdit,
  onCancel,
  onSuccess,
  startTransition
}: ProfileEditableFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const isPhoneField = field === "phone";
  const displayValue = value || "Not set";

  const handleSave = () => {
    startTransition(async () => {
      setErrors({});
      setSuccessMessage("");

      if (isPhoneField) {
        // Phone update requires OTP
        if (!showOTP) {
          // First step: send OTP to new phone
          const result = await sendPhoneUpdateOTP(editValue);

          if (!result.success) {
            if (result.errors) {
              const newErrors: typeof errors = {};
              Object.entries(result.errors).forEach(([field, messages]) => {
                newErrors[field] = messages[0];
              });
              setErrors(newErrors);
            } else {
              setErrors({ general: result.error || "An error occurred" });
            }
            return;
          }

          setSuccessMessage("Verification code sent to your new phone!");
          setShowOTP(true);
          return;
        }

        // Second step: verify OTP and update
        const result = await updatePhone({
          newPhone: editValue,
          code: otpCode
        });

        if (!result.success) {
          if (result.errors) {
            const newErrors: typeof errors = {};
            Object.entries(result.errors).forEach(([field, messages]) => {
              newErrors[field] = messages[0];
            });
            setErrors(newErrors);
          } else {
            setErrors({ general: result.error || "An error occurred" });
          }
          return;
        }

        // Redirect immediately - message will show on sign-in page
        window.location.href = `/account?phoneUpdated=true&newPhone=${encodeURIComponent(editValue)}`;
        return;
      }

      // Name field update
      const result = await updateProfile({ [field]: editValue });

      if (!result.success) {
        if (result.errors) {
          const newErrors: typeof errors = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            newErrors[field] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error || "An error occurred" });
        }
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      onSuccess();
    });
  };

  const handleCancelClick = () => {
    setEditValue(value);
    setShowOTP(false);
    setOtpCode("");
    setErrors({});
    setSuccessMessage("");
    onCancel();
  };

  if (!isEditing) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
          {label}
        </label>
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            {isPhoneField && (
              <CheckCircleIcon className="text-green-600" fontSize="small" />
            )}
            <span className="text-gray-900 font-open-sans">{displayValue}</span>
          </div>
          <IconButton
            onClick={onEdit}
            variant="ghost"
            color="brown"
            aria-label={`Edit ${label.toLowerCase()}`}
            icon={<EditIcon fontSize="small" />}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
        {label}
      </label>
      <div className="space-y-2">
        <Input
          name={field}
          type={isPhoneField ? "tel" : "text"}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          placeholder={
            isPhoneField ? "0234567890" : `Enter ${label.toLowerCase()}`
          }
          disabled={isPending || showOTP}
          autoFocus
          helperText={
            isPhoneField ? "10 digits starting with 02, 03, or 05" : undefined
          }
          error={errors[field]}
        />

        {!showOTP && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              color="brown"
              size="sm"
              onClick={handleSave}
              disabled={isPending || !editValue}
              icon={<SaveIcon sx={{ fontSize: 16 }} />}
              iconPosition="left"
            >
              {isPending
                ? "Saving..."
                : isPhoneField
                  ? "Send verification code"
                  : "Save"}
            </Button>
            <Button
              variant="outline"
              color="brown"
              size="sm"
              onClick={handleCancelClick}
              disabled={isPending}
              icon={<CloseIcon sx={{ fontSize: 16 }} />}
              iconPosition="left"
            >
              Cancel
            </Button>
          </div>
        )}

        {showOTP && (
          <>
            <Input
              label="Verification Code"
              name="otp"
              type="text"
              inputMode="numeric"
              value={otpCode}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtpCode(value);
              }}
              placeholder="000000"
              disabled={isPending}
              helperText="Enter the 6-digit code from SMS"
              error={errors.code}
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                color="brown"
                size="sm"
                onClick={handleSave}
                disabled={isPending || otpCode.length !== 6}
                icon={<SaveIcon sx={{ fontSize: 16 }} />}
                iconPosition="left"
              >
                {isPending ? "Updating..." : "Update Phone"}
              </Button>
              <Button
                variant="outline"
                color="brown"
                size="sm"
                onClick={handleCancelClick}
                disabled={isPending}
                icon={<CloseIcon sx={{ fontSize: 16 }} />}
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>
          </>
        )}

        {/* Error/Success Messages */}
        {errors.general && (
          <p className="text-sm text-red-600 font-open-sans" role="alert">
            {errors.general}
          </p>
        )}

        {successMessage && (
          <p
            className="text-sm text-green-600 font-open-sans flex items-center gap-2"
            role="status"
          >
            <CheckCircleIcon fontSize="small" />
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
}
