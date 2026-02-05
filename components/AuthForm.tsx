"use client";

import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signin" | "signup";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: AuthMode;
}

export function AuthForm({ onSuccess, defaultMode = "signin" }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "apple" | "facebook"
  ) => {
    setIsLoading(true);
    try {
      // TODO: Implement social login
      console.log(`Logging in with ${provider}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess?.();
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Basic validation
      const newErrors: Record<string, string> = {};

      if (mode === "signup") {
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s()-]/g, ""))
      ) {
        newErrors.phone = "Invalid phone number";
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (mode === "signup" && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Call auth methods from context
      if (mode === "signin") {
        await signIn(formData.phone, formData.password);
      } else {
        await signUp({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error(`${mode} failed:`, error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
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
            ? "Sign in to access your account"
            : "Join us to start ordering delicious pizza"}
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-open-sans"
          aria-label="Continue with Google"
        >
          <GoogleIcon className="text-[#4285F4]" />
          Continue with Google
        </button>

        <button
          onClick={() => handleSocialLogin("apple")}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-open-sans"
          aria-label="Continue with Apple"
        >
          <AppleIcon />
          Continue with Apple
        </button>

        <button
          onClick={() => handleSocialLogin("facebook")}
          disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
          disabled={isLoading}
          placeholder="+1 (555) 123-4567"
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
          disabled={isLoading}
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
          disabled={isLoading}
        >
          {isLoading
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
            disabled={isLoading}
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
            disabled={isLoading}
            className="text-sm text-gray-600 hover:text-brown-dark transition-colors font-open-sans disabled:opacity-50"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
}
