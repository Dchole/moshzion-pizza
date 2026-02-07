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
 * Password validation
 * Minimum 8 characters for signup
 */
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

/**
 * Sign in credentials schema
 */
export const signInSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required")
});

/**
 * Sign up credentials schema
 */
export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .trim(),
  phone: phoneSchema,
  password: passwordSchema
});

/**
 * Type inference for TypeScript
 */
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
