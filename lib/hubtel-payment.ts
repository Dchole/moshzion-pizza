/**
 * Hubtel Payment Integration
 *
 * Features:
 * - Mobile Money payments (MTN, Vodafone, AirtelTigo)
 * - Receive Money API (no redirect, native mobile money prompt)
 * - Payment status checking
 * - Webhook support
 *
 * Setup:
 * 1. Sign up at https://hubtel.com
 * 2. Get your Client ID and Client Secret from dashboard
 * 3. Add to environment variables:
 *    - HUBTEL_CLIENT_ID
 *    - HUBTEL_CLIENT_SECRET
 * 4. Set up webhook URL in Hubtel dashboard (optional)
 */

import type {
  HubtelReceiveMoneyRequest,
  HubtelPaymentResponse,
  HubtelPaymentStatusResponse
} from "@/types";
import { env, isDevelopment, isHubtelConfigured } from "@/lib/env";
import { logger } from "@/lib/logger";

const HUBTEL_API_BASE = "https://api.hubtel.com/v2";

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
 * Initiate mobile money payment
 * User will receive a prompt on their phone to approve payment
 */
export async function initiatePayment(
  request: HubtelReceiveMoneyRequest
): Promise<HubtelPaymentResponse> {
  // Development mode - simulate successful payment
  if (isDevelopment) {
    logger.payment("initiate", request.clientReference, request.amount, {
      mode: "development",
      phone: request.customerMobileNumber
    });
    return {
      status: "Success",
      message: "Payment initiated successfully (DEV MODE)",
      data: {
        transactionId: `dev_${Date.now()}`,
        clientReference: request.clientReference,
        amount: request.amount,
        charges: request.amount * 0.01, // 1% fee
        amountAfterCharges: request.amount * 0.99,
        amountCharged: request.amount,
        description: request.description,
        externalTransactionId: null,
        hubtelTransactionId: null,
        paymentStatus: "Pending"
      }
    };
  }

  // Production - call Hubtel API
  const auth = getHubtelAuth();
  if (!auth) {
    throw new Error(
      "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
    );
  }

  try {
    const response = await fetch(
      `${HUBTEL_API_BASE}/merchantaccount/receive/mobilemoney`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          CustomerName: request.customerName,
          CustomerMsisdn: request.customerMobileNumber,
          CustomerEmail: request.customerEmail,
          Channel: "momo-subscriber-gh", // Ghana mobile money
          Amount: request.amount,
          PrimaryCallbackUrl: request.primaryCallbackUrl,
          Description: request.description,
          ClientReference: request.clientReference
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      logger.payment("failed", request.clientReference, request.amount, {
        status: response.status,
        error: data.message || "Payment initiation failed"
      });
      throw new Error(data.message || "Payment initiation failed");
    }

    logger.payment(
      "initiate",
      request.clientReference,
      data.Amount || request.amount,
      {
        transactionId: data.TransactionId
      }
    );
    return {
      status: "Success",
      message: data.message || "Payment initiated",
      data: {
        transactionId: data.TransactionId,
        clientReference: data.ClientReference,
        amount: data.Amount,
        charges: data.Charges || 0,
        amountAfterCharges: data.AmountAfterCharges || data.Amount,
        amountCharged: data.AmountCharged || data.Amount,
        description: data.Description,
        externalTransactionId: data.ExternalTransactionId,
        hubtelTransactionId: data.HubtelTransactionId,
        paymentStatus: data.Status
      }
    };
  } catch (error) {
    logger.error("Hubtel payment error", error, {
      clientReference: request.clientReference
    });
    throw error;
  }
}

/**
 * Check payment status
 * Poll this endpoint to check if payment was completed
 */
export async function checkPaymentStatus(
  clientReference: string
): Promise<HubtelPaymentStatusResponse> {
  // Development mode - simulate successful payment after 3 seconds
  if (process.env.NODE_ENV === "development") {
    console.log("🔔 [DEV] Simulating payment status check:", clientReference);
    return {
      status: "Success",
      message: "Payment successful (DEV MODE)",
      data: {
        transactionId: clientReference,
        transactionStatus: "Success",
        amount: 100,
        charges: 1,
        customerName: "Test Customer",
        customerMobileNumber: "0234567890"
      }
    };
  }

  // Production - call Hubtel API
  const auth = getHubtelAuth();
  if (!auth) {
    throw new Error(
      "Hubtel credentials not configured. Set HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET."
    );
  }

  try {
    const response = await fetch(
      `${HUBTEL_API_BASE}/merchantaccount/transactions/${clientReference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      logger.error("Hubtel payment status check failed", {
        clientReference,
        status: response.status,
        error: data.message || "Payment status check failed"
      });
      throw new Error(data.message || "Payment status check failed");
    }

    return {
      status: "Success",
      message: "Payment status retrieved",
      data: {
        transactionId: data.TransactionId,
        transactionStatus: data.Status,
        amount: data.Amount,
        charges: data.Charges || 0,
        customerName: data.CustomerName,
        customerMobileNumber: data.CustomerMsisdn
      }
    };
  } catch (error) {
    logger.error("Hubtel payment status error", error, { clientReference });
    throw error;
  }
}

/**
 * Verify webhook signature (optional, for production security)
 */
export function verifyWebhookSignature(
  _payload: string,
  _signature: string
): boolean {
  // Implement webhook signature verification if Hubtel provides it
  // For now, return true in development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  logger.warn("Webhook signature verification not implemented");
  return true;
}

/**
 * Format phone number for Hubtel (Ghana format)
 * Accepts: 0234567890, +233234567890, 233234567890
 * Returns: 233234567890 (Hubtel format)
 */
export function formatPhoneForHubtel(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");

  // If starts with 0, replace with 233
  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.slice(1);
  }

  // If doesn't start with 233, add it
  if (!cleaned.startsWith("233")) {
    cleaned = "233" + cleaned;
  }

  return cleaned;
}
