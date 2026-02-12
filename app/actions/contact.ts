"use server";

import { z } from "zod";
import { isContactFormRateLimited } from "@/lib/rate-limit";
import { sanitizeText, sanitizeEmail } from "@/lib/sanitize";
import { logger } from "@/lib/logger";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    _form?: string[];
  };
  message?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message")
  };

  // Rate limiting check (use email as identifier)
  const email = String(rawData.email || "");
  const rateLimitCheck = isContactFormRateLimited(email);

  if (rateLimitCheck.limited) {
    logger.warn("Contact form rate limit exceeded", { email });
    return {
      success: false,
      errors: {
        _form: [
          `Too many submissions. Please try again in ${Math.ceil(rateLimitCheck.resetIn! / 60)} minutes.`
        ]
      }
    };
  }

  // Sanitize inputs
  const data = {
    name: sanitizeText(String(rawData.name || "")),
    email: sanitizeEmail(email),
    subject: sanitizeText(String(rawData.subject || "")),
    message: sanitizeText(String(rawData.message || ""))
  };

  // Validate form data
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    };
  }

  // Simulate sending email (in production, integrate with email service)
  try {
    // TODO: Integrate with actual email service (SendGrid, Resend, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would send the email here:
    // await emailService.send({
    //   to: process.env.CONTACT_EMAIL,
    //   from: result.data.email,
    //   subject: result.data.subject,
    //   body: `From: ${result.data.name}\nEmail: ${result.data.email}\n\n${result.data.message}`
    // });

    logger.info("Contact form submitted", {
      from: result.data.email,
      subject: result.data.subject
    });

    return {
      success: true,
      message:
        "Thank you for reaching out! We'll get back to you within 24 hours."
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        _form: ["Failed to send message. Please try again later."]
      }
    };
  }
}
