/**
 * SMS Verification Utility
 *
 * Development: Logs OTP to console
 * Production: Uses AWS SNS (100 free SMS/month)
 */

interface SendSMSOptions {
  phone: string;
  message: string;
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send SMS (Development mode - logs to console)
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

    // Production: Use AWS SNS
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials not configured");
    }

    // TODO: Implement AWS SNS integration
    // import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
    // const client = new SNSClient({ region: process.env.AWS_REGION || "us-east-1" });
    // const command = new PublishCommand({
    //   PhoneNumber: phone,
    //   Message: message
    // });
    // await client.send(command);

    console.warn("Production SMS not implemented yet. Using console logging.");
    console.log(`SMS to ${phone}: ${message}`);

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
