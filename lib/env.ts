import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  POSTGRES_URL: z.string().optional(),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters")
    .describe("Generate with: openssl rand -base64 32"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
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

export const env = parseEnv();

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isHubtelConfigured =
  !!env.HUBTEL_CLIENT_ID && !!env.HUBTEL_CLIENT_SECRET;
