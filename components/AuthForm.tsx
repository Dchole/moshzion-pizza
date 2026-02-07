"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  sendOTP,
  verifyOTP,
  authenticateWithProvider
} from "@/lib/auth-actions";

interface AuthFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  phone?: string;
  code?: string;
  general?: string;
}

type AuthStep = "phone" | "otp";

export function AuthForm({ onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("phone");
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSocialLogin = (provider: "google" | "facebook") => {
    startTransition(async () => {
      try {
        await authenticateWithProvider(provider);
        onSuccess?.();
      } catch {
        setErrors({ general: "Social login failed. Please try again." });
      }
    });
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setErrors({});
      setSuccessMessage("");

      const result = await sendOTP({ phone });

      if (!result.success) {
        if (result.errors) {
          const newErrors: FormErrors = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            newErrors[field as keyof FormErrors] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error });
        }
        return;
      }

      // Move to OTP step
      setStep("otp");
      setResendTimer(60); // 60 second cooldown
      setSuccessMessage("Verification code sent to your phone!");
    });
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setErrors({});
      setSuccessMessage("");

      const result = await verifyOTP({ phone, code });

      if (!result.success) {
        if (result.errors) {
          const newErrors: FormErrors = {};
          Object.entries(result.errors).forEach(([field, messages]) => {
            newErrors[field as keyof FormErrors] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error });
        }
        return;
      }

      // Show success message for new accounts
      if (result.isNewAccount) {
        setSuccessMessage("Account created successfully! Redirecting...");
      }

      // Redirect to account page
      setTimeout(
        () => {
          router.push("/account");
          router.refresh();
          onSuccess?.();
        },
        result.isNewAccount ? 1000 : 0
      );
    });
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;

    startTransition(async () => {
      setErrors({});
      const result = await sendOTP({ phone });

      if (result.success) {
        setResendTimer(60);
        setSuccessMessage("New verification code sent!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ general: result.error || "Failed to resend code" });
      }
    });
  };

  const handleChangePhone = () => {
    setStep("phone");
    setCode("");
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2
          id="signin-modal-title"
          className="font-display text-3xl text-brown-dark mb-2"
        >
          {step === "phone" ? "Sign In or Create Account" : "Verify Your Phone"}
        </h2>
        <p className="text-gray-600 font-open-sans">
          {step === "phone"
            ? "Enter your phone number to continue"
            : `Enter the 6-digit code sent to ${phone}`}
        </p>
      </div>

      {/* Social Login Buttons - only show on phone step */}
      {step === "phone" && (
        <>
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-open-sans"
              aria-label="Continue with Google"
            >
              <GoogleIcon className="text-[#4285F4]" />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin("facebook")}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-open-sans"
              aria-label="Continue with Facebook"
            >
              <FacebookIcon className="text-[#1877F2]" />
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-open-sans">
                Or continue with phone
              </span>
            </div>
          </div>
        </>
      )}

      {/* Phone Step */}
      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <Input
            label="Phone Number"
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
            autoComplete="tel"
            helperText="We'll send you a verification code"
          />

          {errors.general && (
            <p className="text-sm text-red-600 font-open-sans" role="alert">
              {errors.general}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600 font-open-sans" role="status">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            color="beige"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Sending code..." : "Continue"}
          </Button>
        </form>
      )}

      {/* OTP Step */}
      {step === "otp" && (
        <form onSubmit={handleOTPSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            name="code"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={e => {
              // Only allow digits, max 6
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(value);
              if (errors.code) {
                setErrors(prev => ({ ...prev, code: undefined }));
              }
            }}
            error={errors.code}
            disabled={isPending}
            placeholder="000000"
            required
            autoComplete="one-time-code"
            helperText="Enter the 6-digit code from SMS"
          />

          {errors.general && (
            <p className="text-sm text-red-600 font-open-sans" role="alert">
              {errors.general}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600 font-open-sans" role="status">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            color="beige"
            className="w-full"
            disabled={isPending || code.length !== 6}
          >
            {isPending ? "Verifying..." : "Verify & Continue"}
          </Button>

          {/* Resend and Change Phone */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isPending || resendTimer > 0}
              className="text-brown-dark hover:text-brown-medium font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>

            <button
              type="button"
              onClick={handleChangePhone}
              disabled={isPending}
              className="text-gray-600 hover:text-brown-dark transition-colors disabled:opacity-50 font-open-sans"
            >
              Change phone
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
