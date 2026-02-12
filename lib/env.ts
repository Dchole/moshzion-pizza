import { z } from "zod";

/**
 * Environment variables schema
 * Validates required environment variables at startup
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  POSTGRES_URL: z.string().optional(), // Vercel-specific

  // Authentication
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters")
    .describe("Generate with: openssl rand -base64 32"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // Hubtel credentials (optional in development, required in production)
  HUBTEL_CLIENT_ID: z.string().optional(),
  HUBTEL_CLIENT_SECRET: z.string().optional(),
  HUBTEL_SENDER_ID: z.string().optional()
});

/**
 * Parse and validate environment variables
 * Throws an error if validation fails
 */
function parseEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Environment variable validation failed:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid environment variables");
  }

  // Additional production checks
  if (parsed.data.NODE_ENV === "production") {
    const missingProdVars: string[] = [];

    if (!parsed.data.HUBTEL_CLIENT_ID) {
      missingProdVars.push("HUBTEL_CLIENT_ID");
    }
    if (!parsed.data.HUBTEL_CLIENT_SECRET) {
      missingProdVars.push("HUBTEL_CLIENT_SECRET");
    }

    if (missingProdVars.length > 0) {
      console.warn(
        `⚠️  Warning: The following environment variables are missing in production: ${missingProdVars.join(", ")}`
      );
      console.warn(
        "   Some features (SMS/OTP, payments) may not work correctly."
      );
    }
  }

  return parsed.data;
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 */
export const env = parseEnv();

/**
 * Helper to check if running in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Helper to check if running in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Helper to check if Hubtel is configured
 */
export const isHubtelConfigured =
  !!env.HUBTEL_CLIENT_ID && !!env.HUBTEL_CLIENT_SECRET;
