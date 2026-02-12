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

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

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
   * Log OTP-related events (in development, logs to console)
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
