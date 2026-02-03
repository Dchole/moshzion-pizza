"use client";

import { useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { CONTACT_INFO } from "@/lib/constants";
import { Button, SectionHeader, ContactItem } from "@/components/ui";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error" || status === "success") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error("Failed to subscribe. Please try again."));
          }
        }, 1000);
      });

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <section
        id="newsletter"
        className="bg-(--newsletter-bg) py-16 sm:py-20 pb-24 text-white"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            title="Get Notified"
            subtitle="Get up to date with our services. Get notified with updates to our store and services"
            color="red"
            className="mb-8"
          />

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col gap-4 items-center">
              <label htmlFor="email-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="email-newsletter"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                className="w-full rounded-sm border border-gray-400 bg-(--newsletter-input-bg) px-4 py-3 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                disabled={status === "loading"}
                aria-describedby={
                  status === "error" ? "newsletter-error" : undefined
                }
              />

              {status === "success" && (
                <div
                  className="flex items-center gap-2 text-green-300"
                  role="status"
                >
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                  <span>Thank you for subscribing!</span>
                </div>
              )}

              {status === "error" && (
                <div
                  id="newsletter-error"
                  className="flex items-center gap-2 text-red-300"
                  role="alert"
                >
                  <ErrorIcon sx={{ fontSize: 20 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                color="red"
                disabled={status === "loading"}
                className="rounded-sm"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div className="hidden sm:block relative z-10 -mt-12 -mb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-(--contact-bar-bg) rounded-lg py-5 px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
              <ContactItem
                icon={<PhoneIcon sx={{ fontSize: 32 }} />}
                label="Give us a call"
                value={CONTACT_INFO.phone}
                href={`tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`}
                size="lg"
              />
              <ContactItem
                icon={<EmailIcon sx={{ fontSize: 32 }} />}
                label="Send Us A Message"
                value={CONTACT_INFO.email}
                href={`mailto:${CONTACT_INFO.email}`}
                size="lg"
              />
              <ContactItem
                icon={<LocationOnIcon sx={{ fontSize: 32 }} />}
                label="Location"
                value={CONTACT_INFO.address}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
