/**
 * Phone Number Utilities
 * Extracted to eliminate code duplication across modals and components
 */

import { PAYMENT_PROVIDERS } from "@/lib/config";

/**
 * Detect mobile money provider from Ghana phone number
 * @param phone - Phone number (with or without country code)
 * @returns Provider name (MTN, Vodafone, AirtelTigo, or Mobile Money)
 */
export function detectMobileMoneyProvider(phone: string): string {
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, "");

  // Get the prefix (last 10 digits for local format)
  const localNumber = digitsOnly.slice(-10);
  const prefix = localNumber.substring(0, 3);

  // Detect provider based on prefix
  if (["024", "054", "055", "059"].includes(prefix)) {
    return PAYMENT_PROVIDERS.MTN;
  } else if (["020", "050"].includes(prefix)) {
    return PAYMENT_PROVIDERS.VODAFONE;
  } else if (["027", "057", "026", "056"].includes(prefix)) {
    return PAYMENT_PROVIDERS.AIRTELTIGO;
  }

  return PAYMENT_PROVIDERS.MOBILE_MONEY;
}

/**
 * Format phone number to Ghana local format (0XXXXXXXXX)
 * @param phone - Raw phone input
 * @returns Formatted 10-digit local number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, "");

  // If it starts with 233, remove country code
  if (digitsOnly.startsWith("233")) {
    return "0" + digitsOnly.slice(3, 12);
  }

  // If it doesn't start with 0, add it
  if (!digitsOnly.startsWith("0")) {
    return "0" + digitsOnly.slice(0, 9);
  }

  // Return first 10 digits
  return digitsOnly.slice(0, 10);
}

/**
 * Validate Ghana phone number format
 * @param phone - Phone number to validate
 * @returns true if valid Ghana number (0[235]XXXXXXXX)
 */
export function isValidGhanaPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  const localNumber = digitsOnly.slice(-10);

  // Check if it matches Ghana format: 0[235]XXXXXXXX
  return /^0[235]\d{8}$/.test(localNumber);
}

/**
 * Get last 4 digits of phone number
 * @param phone - Phone number
 * @returns Last 4 digits
 */
export function getPhoneLast4(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.slice(-4);
}
