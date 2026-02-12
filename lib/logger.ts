/**
 * Centralized Logging Utility
 *
 * Provides structured logging with different log levels.
 * In production, this can be extended to send logs to an external service.
 * For now, uses console with proper formatting and context.
 */

import { isDevelopment } from "@/lib/env";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error"
}

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!isDevelopment) {
      return level === LogLevel.WARN || level === LogLevel.ERROR;
    }
    return true;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }

    return `${prefix} ${message}`;
  }

  /**
   * Log debug information
   * @param message - Debug message
   * @param context - Additional context data
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  /**
   * Log informational messages
   * @param message - Info message
   * @param context - Additional context data
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  /**
   * Log warning messages
   * @param message - Warning message
   * @param context - Additional context data
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  /**
   * Log error messages with error object
   * @param message - Error message
   * @param error - Error object or unknown error
   * @param context - Additional context data
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      })
    };

    console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
  }

  /**
   * Log OTP-related events
   * @param action - The OTP action being performed (send, verify, or resend)
   * @param phone - Phone number involved
   * @param success - Whether the action was successful
   * @param details - Additional context data
   */
  otp(
    action: "send" | "verify" | "resend",
    phone: string,
    success: boolean,
    details?: LogContext
  ): void {
    if (isDevelopment) {
      const message = `OTP ${action} for ${phone}: ${success ? "✓ Success" : "✗ Failed"}`;
      this.info(message, details);
    }
  }

  /**
   * Log payment-related events
   * @param action - The payment action (initiate, success, or failed)
   * @param orderId - Order ID associated with the payment
   * @param amount - Payment amount in GHS
   * @param details - Additional context data
   */
  payment(
    action: "initiate" | "success" | "failed",
    orderId: string,
    amount: number,
    details?: LogContext
  ): void {
    const message = `Payment ${action} for order ${orderId} (GHS ${amount})`;

    if (action === "failed") {
      this.error(message, undefined, details);
    } else {
      this.info(message, details);
    }
  }

  /**
   * Log order-related events
   * @param action - The order action (created, updated, or cancelled)
   * @param orderId - Order ID
   * @param details - Additional context data
   */
  order(
    action: "created" | "updated" | "cancelled",
    orderId: string,
    details?: LogContext
  ): void {
    this.info(`Order ${action}: ${orderId}`, details);
  }

  /**
   * Log authentication events
   * @param action - The auth action (login, logout, or register)
   * @param userId - Optional user ID
   * @param details - Additional context data
   */
  auth(
    action: "login" | "logout" | "register",
    userId?: string,
    details?: LogContext
  ): void {
    this.info(`Auth ${action}${userId ? ` for user ${userId}` : ""}`, details);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper function to safely stringify errors for logging
 * @param error - Error object or unknown error
 * @returns Serialized error object with name, message, and stack
 */
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return { error: String(error) };
}
