"use client";

import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { signOutUser, sendOTP, verifyOTP } from "@/lib/auth-actions";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface AccountContentProps {
  user: User | null;
}

export function AccountContent({ user }: AccountContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditingPhone, setIsEditingPhone] = useState(!user);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
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

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutUser();
    });
  };

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
      setTimeout(() => setSuccessMessage(""), 3000);
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
        result.isNewAccount ? "Account created!" : "Phone verified!"
      );

      // Refresh to show authenticated state
      setTimeout(() => {
        router.refresh();
      }, 500);
    });
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    handlePhoneSave();
  };

  const userData = {
    name:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "Not provided",
    phone: user?.phone || ""
  };

  const isAuthenticated = !!user;

  // Mock data (will be replaced with real data from DB)
  const savedAddresses: any[] = [];
  const paymentMethods: any[] = [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            My Account
          </h1>
          <p className="mt-2 text-gray-600 font-open-sans">
            {isAuthenticated
              ? "Manage your profile, addresses, and payment methods"
              : "Enter your phone number to save your account information"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-labelledby="profile-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PersonIcon className="text-brown-dark" />
                <h2
                  id="profile-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Profile Information
                </h2>
              </div>
              {isAuthenticated && (
                <button
                  className="rounded-lg p-2 text-brown-dark hover:bg-gray-100 transition-colors"
                  aria-label="Edit profile"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Phone Number Field */}
              <div>
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
                  disabled={isAuthenticated || isPending}
                  placeholder="0234567890"
                  required
                  helperText={
                    !isAuthenticated
                      ? "10 digits starting with 02, 03, or 05"
                      : undefined
                  }
                  endIcon={
                    isAuthenticated ? (
                      <CheckCircleIcon
                        className="text-green-600"
                        fontSize="small"
                      />
                    ) : undefined
                  }
                />
              </div>

              {/* OTP Input - Inline with reveal animation */}
              {showOTPInput && !isAuthenticated && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <Input
                    label="Verification Code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={e => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
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
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isPending || resendTimer > 0}
                      className="text-brown-dark hover:text-brown-medium font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-open-sans"
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend code"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowOTPInput(false);
                        setOtpCode("");
                        setErrors({});
                      }}
                      disabled={isPending}
                      className="text-gray-600 hover:text-brown-dark transition-colors disabled:opacity-50 font-open-sans"
                    >
                      Change phone
                    </button>
                  </div>
                </div>
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

              {/* Save/Verify Button */}
              {!isAuthenticated && (
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
                      ? "Verify & Save"
                      : "Verify and save phone"}
                </Button>
              )}

              {/* Name Fields */}
              <div>
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={user?.firstName || ""}
                  disabled={!isAuthenticated}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={user?.lastName || ""}
                  disabled={!isAuthenticated}
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-labelledby="quick-actions-heading"
          >
            <div className="mb-4">
              <h2
                id="quick-actions-heading"
                className="font-display text-2xl text-brown-dark"
              >
                Quick Actions
              </h2>
            </div>

            <div className="space-y-3">
              <Button
                href="/orders"
                variant="outline"
                color="brown"
                className="w-full justify-start"
                icon={<ReceiptIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                View Order History
              </Button>

              <Button
                href="/track-order"
                variant="outline"
                color="brown"
                className="w-full justify-start"
                icon={<LocalShippingIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Track My Order
              </Button>

              <Button
                href="/store"
                variant="primary"
                color="beige"
                className="w-full justify-start"
                icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Start New Order
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  color="brown"
                  className="w-full justify-start"
                  icon={<LogoutIcon sx={{ fontSize: 20 }} />}
                  iconPosition="left"
                  onClick={handleSignOut}
                  disabled={isPending}
                >
                  {isPending ? "Signing out..." : "Sign Out"}
                </Button>
              )}
            </div>
          </section>

          {/* Saved Addresses */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-labelledby="addresses-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocationOnIcon className="text-brown-dark" />
                <h2
                  id="addresses-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Saved Addresses
                </h2>
              </div>
              <Button
                variant="outline"
                color="brown"
                size="sm"
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                iconPosition="left"
                disabled={!isAuthenticated}
              >
                Add Address
              </Button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="text-center py-8">
                <LocationOnIcon
                  className="mx-auto text-gray-300 mb-3"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-gray-600 font-open-sans">
                  {isAuthenticated
                    ? "No addresses saved yet. Add one to get started!"
                    : "Sign in to save delivery addresses"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {savedAddresses.map(address => (
                  <div
                    key={address.id}
                    className="rounded-lg border border-gray-200 p-4 relative"
                  >
                    {address.isDefault && (
                      <span className="absolute top-2 right-2 rounded-full bg-beige-light px-3 py-1 text-xs font-medium text-brown-dark font-open-sans">
                        Default
                      </span>
                    )}

                    <h3 className="font-display text-lg text-brown-dark mb-2">
                      {address.label}
                    </h3>

                    <address className="not-italic text-sm text-gray-600 font-open-sans">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zip}
                    </address>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors font-open-sans"
                        aria-label={`Edit ${address.label} address`}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${address.label} address`}
                        disabled={address.isDefault}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment Methods */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-labelledby="payment-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PaymentIcon className="text-brown-dark" />
                <h2
                  id="payment-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Payment Methods
                </h2>
              </div>
              <Button
                variant="outline"
                color="brown"
                size="sm"
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                iconPosition="left"
                disabled={!isAuthenticated}
              >
                Add Card
              </Button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <PaymentIcon
                  className="mx-auto text-gray-300 mb-3"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-gray-600 font-open-sans">
                  {isAuthenticated
                    ? "No payment methods saved yet. Add one for faster checkout!"
                    : "Sign in to save payment methods"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="rounded-lg border border-gray-200 p-4 relative"
                  >
                    {method.isDefault && (
                      <span className="absolute top-2 right-2 rounded-full bg-beige-light px-3 py-1 text-xs font-medium text-brown-dark font-open-sans">
                        Default
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded bg-gray-100 p-2">
                        <PaymentIcon className="text-brown-dark" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-brown-dark">
                          {method.type} •••• {method.last4}
                        </h3>
                        <p className="text-sm text-gray-600 font-open-sans">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors font-open-sans"
                        aria-label={`Edit ${method.type} ending in ${method.last4}`}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${method.type} ending in ${method.last4}`}
                        disabled={method.isDefault}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
