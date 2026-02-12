/**
 * Rate Limiting Utilities
 *
 * Simple in-memory rate limiter for server actions.
 * For production at scale, consider Redis-based rate limiting.
 */

import { RATE_LIMITS } from "@/lib/config";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (will reset on server restart)
// For production with multiple instances, use Redis
const store = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Check if a key has exceeded the rate limit
 * @param key - Unique identifier (e.g., phone number, IP address, user ID)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limit exceeded, false otherwise
 */
export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  // No entry or expired entry
  if (!entry || now > entry.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return false;
  }

  // Increment counter
  entry.count++;

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    return true;
  }

  return false;
}

/**
 * Get remaining requests for a key
 */
export function getRemainingRequests(key: string, maxRequests: number): number {
  const entry = store.get(key);
  if (!entry) return maxRequests;

  const remaining = maxRequests - entry.count;
  return Math.max(0, remaining);
}

/**
 * Get time until rate limit resets (in seconds)
 */
export function getResetTime(key: string): number {
  const entry = store.get(key);
  if (!entry) return 0;

  const now = Date.now();
  if (now > entry.resetAt) return 0;

  return Math.ceil((entry.resetAt - now) / 1000);
}

/**
 * Rate limit OTP requests
 */
export function isOTPRateLimited(phone: string): {
  limited: boolean;
  resetIn?: number;
  remaining?: number;
} {
  const key = `otp:${phone}`;
  const limited = isRateLimited(key, RATE_LIMITS.otpPerHour, 60 * 60 * 1000);

  if (limited) {
    return {
      limited: true,
      resetIn: getResetTime(key)
    };
  }

  return {
    limited: false,
    remaining: getRemainingRequests(key, RATE_LIMITS.otpPerHour)
  };
}

/**
 * Rate limit contact form submissions
 */
export function isContactFormRateLimited(identifier: string): {
  limited: boolean;
  resetIn?: number;
  remaining?: number;
} {
  const key = `contact:${identifier}`;
  const limited = isRateLimited(
    key,
    RATE_LIMITS.contactFormPerDay,
    24 * 60 * 60 * 1000
  );

  if (limited) {
    return {
      limited: true,
      resetIn: getResetTime(key)
    };
  }

  return {
    limited: false,
    remaining: getRemainingRequests(key, RATE_LIMITS.contactFormPerDay)
  };
}

/**
 * Rate limit order creation
 */
export function isOrderRateLimited(userId: string): {
  limited: boolean;
  resetIn?: number;
  remaining?: number;
} {
  const key = `order:${userId}`;
  const limited = isRateLimited(key, RATE_LIMITS.ordersPerHour, 60 * 60 * 1000);

  if (limited) {
    return {
      limited: true,
      resetIn: getResetTime(key)
    };
  }

  return {
    limited: false,
    remaining: getRemainingRequests(key, RATE_LIMITS.ordersPerHour)
  };
}

/**
 * Reset rate limit for a key (useful for testing or admin operations)
 */
export function resetRateLimit(key: string): void {
  store.delete(key);
}
