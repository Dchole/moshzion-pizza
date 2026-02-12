/**
 * Input Sanitization Utilities
 *
 * Prevents XSS and other injection attacks by sanitizing user input.
 * Use for any user-generated content that will be displayed.
 */

/**
 * Sanitize HTML content - removes all HTML tags and dangerous characters
 * Use for text that should never contain HTML
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitize phone number - removes all non-digit characters
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";
  return phone.replace(/\D/g, "");
}

/**
 * Sanitize email - basic cleanup
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.toLowerCase().trim();
}

/**
 * Sanitize name fields - allows letters, spaces, hyphens, apostrophes
 */
export function sanitizeName(name: string): string {
  if (typeof name !== "string") return "";

  return name
    .replace(/[^a-zA-Z\s\-']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitize address - allows alphanumeric, spaces, and common punctuation
 */
export function sanitizeAddress(address: string): string {
  if (typeof address !== "string") return "";

  return address
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sanitize search query - removes special characters that could be dangerous
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== "string") return "";

  return query
    .replace(/[<>'"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100); // Limit length
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Strip all HTML tags and scripts from content
 * More aggressive than sanitizeText
 */
export function stripHtml(html: string): string {
  if (typeof html !== "string") return "";

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Sanitize order/cart data
 */
export function sanitizeOrderItem(item: { name: string; toppings: string[] }): {
  name: string;
  toppings: string[];
} {
  return {
    name: sanitizeText(item.name),
    toppings: item.toppings.map(t => sanitizeText(t))
  };
}

/**
 * Type guard to check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
