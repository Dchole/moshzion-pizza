/**
 * SMS Verification Utility
 *
 * Development: Logs OTP to console
 * Production: Uses Hubtel SMS (Ghana-based, ~$0.003-0.006 per SMS)
 * 
 * Setup:
 * 1. Sign up at https://hubtel.com
 * 2. Get ClientId and ClientSecret from dashboard
 * 3. Add to Vercel: HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET, HUBTEL_SENDER_ID
 */

interface SendSMSOptions {
  phone: string;
  message: string;
}

/**
 * Format Ghana phone number to international format (233XXXXXXXXX)
 * Accepts: 0244123456 or 244123456 or 233244123456
 */
function formatGhanaPhone(phone: string): string {
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
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send SMS via Hubtel (Production) or console (Development)
 */
export async function sendSMS({ phone, message }: SendSMSOptions): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (process.env.NODE_ENV === "development") {
      // Development: Log to console
      console.log("\n=== SMS VERIFICATION (DEV MODE) ===");
      console.log(`To: ${phone}`);
      console.log(`Message: ${message}`);
      console.log("====================================\n");
      return { success: true };
    }

    // Production: Use Hubtel SMS API
    const clientId = process.env.HUBTEL_CLIENT_ID;
    const clientSecret = process.env.HUBTEL_CLIENT_SECRET;
    const senderId = process.env.HUBTEL_SENDER_ID || "Moshzion";

    if (!clientId || !clientSecret) {
      throw new Error(
        "Hubtel credentials not configured. Please set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET environment variables."
      );
    }

    // Format phone to international format
    const formattedPhone = formatGhanaPhone(phone);

    // Create Basic Auth header
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    // Send SMS via Hubtel API
    const response = await fetch("https://sms.hubtel.com/v1/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`
      },
      body: JSON.stringify({
        From: senderId,
        To: formattedPhone,
        Content: message
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Hubtel API error (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();
    
    // Hubtel returns a status code in the response
    if (data.Status !== 0) {
      throw new Error(`SMS failed: ${data.Message || "Unknown error"}`);
    }

    console.log(`✓ SMS sent to ${phone} via Hubtel`);
    return { success: true };
  } catch (error) {
    console.error("SMS sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS"
    };
  }
}

/**
 * Send OTP verification code via SMS
 * @param phone - Phone number to send to
 * @param otp - The OTP code to send
 */
export async function sendOTPVerification(
  phone: string,
  otp: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const message = `Your Moshzion Pizza verification code is: ${otp}. Valid for 10 minutes.`;

  const result = await sendSMS({ phone, message });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
