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
  const clientId = process.env.HUBTEL_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

/**
 * Send OTP via Hubtel OTP API
 * Returns requestId needed for verification
 */
export async function sendOTP(phone: string): Promise<{
  success: boolean;
  requestId?: string;
  otpCode?: string; // Only in development
  error?: string;
}> {
  try {
    // Development: Generate and log OTP
    if (process.env.NODE_ENV === "development") {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("\n=== OTP VERIFICATION (DEV MODE) ===");
      console.log(`Phone: ${phone}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log(`Valid for: 10 minutes`);
      console.log("====================================\n");
      return {
        success: true,
        requestId: `dev-${Date.now()}`,
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

    const response = await fetch("https://sms.hubtel.com/v1/otp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        phoneNumber: formattedPhone,
        prefix: "Moshzion", // Shows in SMS as sender
        expiry: 600 // 10 minutes in seconds
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Hubtel OTP API error (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();

    if (!data.requestId) {
      throw new Error("No requestId returned from Hubtel");
    }

    console.log(`✓ OTP sent to ${phone} via Hubtel OTP API`);
    return {
      success: true,
      requestId: data.requestId
    };
  } catch (error) {
    console.error("OTP sending failed:", error);
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
  code: string
): Promise<{
  success: boolean;
  verified: boolean;
  error?: string;
}> {
  try {
    // Development: Simple verification (any 6-digit code works)
    if (process.env.NODE_ENV === "development") {
      const isValid = /^\d{6}$/.test(code);
      console.log("\n=== OTP VERIFICATION (DEV MODE) ===");
      console.log(`RequestId: ${requestId}`);
      console.log(`Code: ${code}`);
      console.log(`Result: ${isValid ? "✓ Valid" : "✗ Invalid"}`);
      console.log("====================================\n");
      return {
        success: true,
        verified: isValid
      };
    }

    // Production: Use Hubtel OTP API
    const auth = getHubtelAuth();
    if (!auth) {
      throw new Error(
        "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
      );
    }

    const response = await fetch("https://sms.hubtel.com/v1/otp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        requestId,
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

    console.log(`✓ OTP verification: ${data.verified ? "Success" : "Failed"}`);

    return {
      success: true,
      verified: data.verified === true
    };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return {
      success: false,
      verified: false,
      error: error instanceof Error ? error.message : "Failed to verify OTP"
    };
  }
}
