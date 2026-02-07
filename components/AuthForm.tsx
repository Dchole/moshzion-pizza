"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  authenticateWithCredentials,
  authenticateWithProvider,
  registerUser
} from "@/lib/auth-actions";
import { signInSchema, signUpSchema } from "@/lib/schemas/auth";
import { z } from "zod";

type AuthMode = "signin" | "signup";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: AuthMode;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  general?: string;
}

export function AuthForm({ onSuccess, defaultMode = "signin" }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    try {
      if (mode === "signup") {
        signUpSchema.parse(formData);
      } else {
        signInSchema.parse({
          phone: formData.phone,
          password: formData.password
        });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(err => {
          const field = err.path[0] as keyof FormErrors;
          if (field) {
            newErrors[field] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    startTransition(async () => {
      setErrors({});

      if (mode === "signin") {
        const result = await authenticateWithCredentials({
          phone: formData.phone,
          password: formData.password
        });

        if (!result.success) {
          // Handle field-specific errors from server
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

        router.push("/account");
        router.refresh();
        onSuccess?.();
      } else {
        // Sign up
        const result = await registerUser(formData);

        if (!result.success) {
          // Handle field-specific errors from server
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

        // After successful registration, automatically sign in
        const signInResult = await authenticateWithCredentials({
          phone: formData.phone,
          password: formData.password
        });

        if (!signInResult.success) {
          // Registration succeeded but sign in failed
          setMode("signin");
          setErrors({
            general: "Account created! Please sign in."
          });
          return;
        }

        router.push("/account");
        router.refresh();
        onSuccess?.();
      }
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2
          id="signin-modal-title"
          className="font-display text-3xl text-brown-dark mb-2"
        >
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-600 font-open-sans">
          {mode === "signin"
            ? "Sign in to view your saved information"
            : "Save your info for faster ordering"}
        </p>
      </div>

      {/* Social Login Buttons */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              disabled={isPending}
              required
              autoComplete="given-name"
            />
            <Input
              label="Last Name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              disabled={isPending}
              required
              autoComplete="family-name"
            />
          </div>
        )}

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          disabled={isPending}
          placeholder="0234567890"
          required
          autoComplete="tel"
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          disabled={isPending}
          required
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          helperText={mode === "signup" ? "At least 8 characters" : undefined}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          }
        />

        {errors.general && (
          <p className="text-sm text-red-600 font-open-sans" role="alert">
            {errors.general}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          color="beige"
          className="w-full"
          disabled={isPending}
        >
          {isPending
            ? "Please wait..."
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </Button>
      </form>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 font-open-sans">
          {mode === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            disabled={isPending}
            className="font-medium text-brown-dark hover:text-brown-medium transition-colors disabled:opacity-50"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      {mode === "signin" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              /* TODO: Implement forgot password */
            }}
            disabled={isPending}
            className="text-sm text-gray-600 hover:text-brown-dark transition-colors font-open-sans disabled:opacity-50"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
}
