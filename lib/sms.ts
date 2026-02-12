/**
 * SMS & OTP Verification Utility (Hubtel OTP API)
 *
 * Development: Logs OTP to console
 * Production: Uses Hubtel OTP API (Ghana-based, ~$0.003-0.006 per SMS)
 *
 * Benefits of Hubtel OTP API:
 * - More secure (OTP never stored in your database)
 * - Built-in rate limiting & retry logic
 * - Automatic expiration handling
 * - Professional OTP message templates
 *
 * Setup:
 * 1. Sign up at https://hubtel.com
 * 2. Get ClientId and ClientSecret from dashboard
 * 3. Add to Vercel: HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET
 */

import { env, isDevelopment, isHubtelConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";
import { isOTPRateLimited } from "@/lib/rate-limit";

/**
 * Format Ghana phone number to international format (233XXXXXXXXX)
 * Accepts: 0244123456 or 244123456 or 233244123456
 */
export function formatGhanaPhone(phone: string): string {
  // Remove any spaces or special characters
  const cleaned = phone.replace(/\D/g, "");

  // If starts with 0, replace with 233
  if (cleaned.startsWith("0")) {
    return "233" + cleaned.slice(1);
  }

  // If already has 233, return as is
  if (cleaned.startsWith("233")) {
    return cleaned;
  }

  // Otherwise, add 233
  return "233" + cleaned;
}

/**
 * Get Hubtel Basic Auth credentials
 */
function getHubtelAuth(): string | null {
  if (!isHubtelConfigured) {
    return null;
  }

  return Buffer.from(
    `${env.HUBTEL_CLIENT_ID}:${env.HUBTEL_CLIENT_SECRET}`
  ).toString("base64");
}

/**
 * Send OTP via Hubtel OTP API
 * Returns requestId and prefix needed for verification
 */
export async function sendOTP(phone: string): Promise<{
  success: boolean;
  requestId?: string;
  prefix?: string;
  otpCode?: string; // Only in development
  error?: string;
}> {
  try {
    // Check rate limit
    const rateLimitCheck = isOTPRateLimited(phone);
    if (rateLimitCheck.limited) {
      logger.warn("OTP rate limit exceeded", {
        phone,
        resetIn: rateLimitCheck.resetIn
      });
      return {
        success: false,
        error: `Too many OTP requests. Please try again in ${rateLimitCheck.resetIn} seconds.`
      };
    }

    // Development: Generate and log OTP
    if (isDevelopment) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      logger.otp("send", phone, true, { code: otpCode, mode: "development" });
      return {
        success: true,
        requestId: `dev-${Date.now()}`,
        prefix: "DEV",
        otpCode // Return code for dev testing
      };
    }

    // Production: Use Hubtel OTP API
    const auth = getHubtelAuth();
    if (!auth) {
      throw new Error(
        "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
      );
    }

    const formattedPhone = formatGhanaPhone(phone);

    const senderId = env.HUBTEL_SENDER_ID;

    const response = await fetch("https://api-otp.hubtel.com/otp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        senderId: senderId,
        phoneNumber: formattedPhone,
        countryCode: "GH"
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Hubtel OTP API error (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();

    if (data.code !== "0000" || !data.data?.requestId) {
      throw new Error(`Hubtel OTP failed: ${data.message || "Unknown error"}`);
    }

    console.log(`✓ OTP sent to ${phone} via Hubtel OTP API`);
    console.log(`  RequestId: ${data.data.requestId}`);
    console.log(`  Prefix: ${data.data.prefix}`);
    return {
      success: true,
      requestId: data.data.requestId,
      prefix: data.data.prefix
    };
  } catch (error) {
    logger.error("OTP sending failed", error, { phone });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send OTP"
    };
  }
}

/**
 * Verify OTP via Hubtel OTP API
 */
export async function verifyOTP(
  requestId: string,
  prefix: string,
  code: string
): Promise<{
  success: boolean;
  verified: boolean;
  error?: string;
}> {
  try {
    if (process.env.NODE_ENV === "development") {
      const isValid = /^\d{6}$/.test(code);
      console.log("\n=== OTP VERIFICATION (DEV MODE) ===");
      console.log(`RequestId: ${requestId}`);
      console.log(`Prefix: ${prefix}`);
      console.log(`Code: ${code}`);
      console.log(`Result: ${isValid ? "✓ Valid" : "✗ Invalid"}`);
      console.log("====================================\n");
      return {
        success: true,
        verified: isValid
      };
    }

    const auth = getHubtelAuth();
    if (!auth) {
      throw new Error(
        "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
      );
    }

    const response = await fetch("https://api-otp.hubtel.com/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        requestId,
        prefix,
        code
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Hubtel verify API error (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();

    const verified = data.code === "0000";
    console.log(`✓ OTP verification: ${verified ? "Success" : "Failed"}`);

    return {
      success: true,
      verified
    };
  } catch (error) {
    logger.error("OTP verification failed", error, { requestId });
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : "Failed to verify OTP"
    };
  }
}

/**
 * Resend OTP via Hubtel OTP API
 * Uses existing requestId to resend the same OTP
 */
export async function resendOTP(requestId: string): Promise<{
  success: boolean;
  requestId?: string;
  prefix?: string;
  error?: string;
}> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== OTP RESEND (DEV MODE) ===");
      console.log(`RequestId: ${requestId}`);
      console.log(`Status: Resent successfully`);
      console.log("============================\n");
      return {
        success: true,
        requestId,
        prefix: "DEV"
      };
    }

    const auth = getHubtelAuth();
    if (!auth) {
      throw new Error(
        "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
      );
    }

    const response = await fetch("https://api-otp.hubtel.com/otp/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        requestId
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Hubtel resend API error (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();

    if (data.code !== "0000" || !data.data?.requestId) {
      throw new Error(
        `Hubtel OTP resend failed: ${data.message || "Unknown error"}`
      );
    }

    console.log(`✓ OTP resent successfully`);
    return {
      success: true,
      requestId: data.data.requestId,
      prefix: data.data.prefix
    };
  } catch (error) {
    logger.error("OTP resend failed", error, { requestId });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resend OTP"
    };
  }
}
