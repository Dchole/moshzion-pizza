"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { Button, Input } from "@/components/ui";
import { sendOTP, verifyOTP } from "@/lib/auth-actions";

interface PhoneVerificationProps {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}

export function PhoneVerification({
  isPending,
  startTransition
}: PhoneVerificationProps) {
  const searchParams = useSearchParams();
  const phoneUpdated = searchParams.get("phoneUpdated");
  const newPhone = searchParams.get("newPhone");

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [phone, setPhone] = useState(newPhone || "");
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState<{
    phone?: string;
    code?: string;
    general?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handlePhoneSave = () => {
    startTransition(async () => {
      setErrors({});
      setSuccessMessage("");

      const result = await sendOTP({ phone });

      if (!result.success) {
        if (result.errors) {
          const newErrors: typeof errors = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            newErrors[field as keyof typeof errors] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error });
        }
        return;
      }

      setShowOTPInput(true);
      setResendTimer(60);
      setSuccessMessage("Verification code sent to your phone!");
    });
  };

  const handleOTPVerify = () => {
    startTransition(async () => {
      setErrors({});
      setSuccessMessage("");

      const result = await verifyOTP({ phone, code: otpCode });

      if (!result.success) {
        if (result.errors) {
          const newErrors: typeof errors = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            newErrors[field as keyof typeof errors] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error });
        }
        return;
      }

      setSuccessMessage(
        result.isNewAccount ? "Welcome! Account created." : "Welcome back!"
      );

      setTimeout(() => {
        window.location.href = "/account";
      }, 500);
    });
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    handlePhoneSave();
  };

  return (
    <div className="space-y-4">
      {phoneUpdated && newPhone && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <InfoIcon className="text-blue-600 shrink-0" fontSize="small" />
            <div className="text-sm text-blue-900 font-open-sans space-y-1">
              <p className="font-semibold">
                Phone number updated successfully!
              </p>
              <p>
                Your phone number has been changed to{" "}
                <strong>{newPhone}</strong>. Since your phone is how you sign
                in, you&apos;ve been logged out. Please sign in again with your
                new number below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 font-open-sans space-y-1">
        <p>Enter your phone number to continue.</p>
        <p className="text-xs text-gray-500">
          New here? An account will be created automatically.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 font-open-sans">
          Phone Number
        </label>
        <Input
          name="phone"
          type="tel"
          value={phone}
          onChange={e => {
            setPhone(e.target.value);
            if (errors.phone) {
              setErrors(prev => ({ ...prev, phone: undefined }));
            }
          }}
          error={errors.phone}
          disabled={isPending}
          placeholder="0234567890"
          required
          helperText="10 digits starting with 02, 03, or 05"
        />
      </div>

      {showOTPInput && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <Input
            label="Verification Code"
            name="code"
            type="text"
            inputMode="numeric"
            value={otpCode}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtpCode(value);
              if (errors.code) {
                setErrors(prev => ({ ...prev, code: undefined }));
              }
            }}
            error={errors.code}
            disabled={isPending}
            placeholder="000000"
            required
            helperText="Enter the 6-digit code from SMS"
          />

          <div className="mt-2 flex items-center justify-between text-sm">
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={isPending || resendTimer > 0}
              className="text-brown-dark hover:text-brown-medium font-medium"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setShowOTPInput(false);
                setOtpCode("");
                setErrors({});
              }}
              disabled={isPending}
              className="text-gray-600 hover:text-brown-dark"
            >
              Change phone
            </Button>
          </div>
        </div>
      )}

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

      <Button
        variant="primary"
        color="beige"
        className="w-full"
        disabled={
          isPending ||
          (showOTPInput && otpCode.length !== 6) ||
          (!showOTPInput && !phone)
        }
        onClick={showOTPInput ? handleOTPVerify : handlePhoneSave}
      >
        {isPending
          ? showOTPInput
            ? "Verifying..."
            : "Sending code..."
          : showOTPInput
            ? "Verify & Continue"
            : "Send verification code"}
      </Button>
    </div>
  );
}
