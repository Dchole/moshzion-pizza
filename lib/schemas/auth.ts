import { z } from "zod";

/**
 * Phone number validation for local format
 * Must be 10 digits starting with 02, 03, or 05
 * Examples: 0234567890, 0312345678, 0556789012
 */
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^(02|03|05)\d{8}$/, {
    message: "Phone number must start with 02, 03, or 05 and be 10 digits"
  })
  .transform(val => val.replace(/\s/g, "")); // Remove any spaces

/**
 * OTP code validation
 * Must be exactly 6 digits
 */
export const otpSchema = z
  .string()
  .min(1, "Verification code is required")
  .regex(/^\d{6}$/, "Code must be exactly 6 digits");

/**
 * Send OTP schema - request verification code
 */
export const sendOTPSchema = z.object({
  phone: phoneSchema
});

/**
 * Verify OTP schema - check verification code
 */
export const verifyOTPSchema = z.object({
  phone: phoneSchema,
  code: otpSchema
});

/**
 * Type inference for TypeScript
 */
export type SendOTPInput = z.infer<typeof sendOTPSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
