/**
 * Business Configuration
 * Centralized location for all business logic constants
 */

/**
 * Pricing configuration
 */
export const PRICING = {
  /** Fixed delivery fee in GHS */
  deliveryFee: 5.0,
  /** Tax rate (10%) */
  taxRate: 0.1,
  /** Minimum order amount */
  minOrderAmount: 0
} as const;

/**
 * Validation patterns and rules
 */
export const VALIDATION = {
  /** Ghana phone number pattern (local format: 0XXXXXXXXX) */
  phoneRegex: /^0[235]\d{8}$/,
  /** Ghana phone number pattern explanation */
  phoneHelp:
    "Enter a valid Ghana phone number (10 digits starting with 024, 054, 055, 059, 020, 050, 027, 057, 026, or 056)",
  /** Credit card number length (without spaces) */
  cardNumberLength: 16,
  /** CVV length */
  cvvLength: 3,
  /** Expiry format MM/YY */
  expiryFormat: /^(0[1-9]|1[0-2])\/\d{2}$/
} as const;

/**
 * Cart limits and constraints
 */
export const CART = {
  /** Maximum number of different items in cart */
  maxItems: 50,
  /** Maximum quantity per item */
  maxQuantityPerItem: 10,
  /** Minimum quantity per item */
  minQuantityPerItem: 1
} as const;

/**
 * Order status configuration
 */
export const ORDER_STATUS = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  preparing: "PREPARING",
  outForDelivery: "OUT_FOR_DELIVERY",
  delivered: "DELIVERED",
  cancelled: "CANCELLED"
} as const;

/**
 * Payment status configuration
 */
export const PAYMENT_STATUS = {
  pending: "PENDING",
  paid: "PAID",
  failed: "FAILED",
  refunded: "REFUNDED"
} as const;

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  creditCard: "credit-card",
  mobileMoney: "mobile-money",
  cashOnDelivery: "cash-on-delivery"
} as const;

/**
 * OTP configuration
 */
export const OTP = {
  /** OTP code length */
  codeLength: 6,
  /** OTP expiry time in minutes */
  expiryMinutes: 10,
  /** Maximum OTP attempts */
  maxAttempts: 3,
  /** Cooldown period between OTP requests (seconds) */
  resendCooldown: 60
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  /** OTP requests per phone number per hour */
  otpPerHour: 5,
  /** Contact form submissions per IP per day */
  contactFormPerDay: 10,
  /** Order creation per user per hour */
  ordersPerHour: 20,
  /** Payment attempts per order */
  paymentAttemptsPerOrder: 3
} as const;

/**
 * Cookie configuration
 */
export const COOKIES = {
  /** Cart cookie name */
  cart: "cart",
  /** Cart cookie max age (7 days in seconds) */
  cartMaxAge: 60 * 60 * 24 * 7
} as const;

/**
 * Helper function to calculate order totals
 */
export function calculateOrderTotals(subtotal: number) {
  const deliveryFee = PRICING.deliveryFee;
  const tax = subtotal * PRICING.taxRate;
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    total
  };
}

/**
 * Helper function to validate Ghana phone number
 */
export function isValidGhanaPhone(phone: string): boolean {
  return VALIDATION.phoneRegex.test(phone);
}

/**
 * Helper function to format phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  // Format: 0XX XXX XXXX
  if (phone.length === 10) {
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  }
  return phone;
}

/**
 * Helper function to validate order status transition
 */
export function canTransitionOrderStatus(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
