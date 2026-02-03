"use client";

import { useState, useCallback } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { CONTACT_INFO } from "@/lib/constants";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      // Reset status when user starts typing again
      if (status === "error" || status === "success") {
        setStatus("idle");
      }
    },
    [status]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
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
  }, []);

  return (
    <>
      <section
        id="newsletter"
        className="bg-(--newsletter-bg) py-16 sm:py-20 pb-24 text-white"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Header */}
          <h2 className="font-display text-5xl sm:text-6xl mb-6 text-(--newsletter-heading)">
            Get Notified
          </h2>
          <p className="text-lg text-(--newsletter-body) mb-8 max-w-lg mx-auto">
            Get up to date with our services. Get notified with updates to our
            store and services
          </p>

          {/* Newsletter Form */}
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

              {/* Status Messages */}
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

              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-sm border border-gray-300 bg-white px-10 py-2.5 font-medium text-(--newsletter-bg) hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Bar - Floating (hidden on mobile) */}
      <div className="hidden sm:block relative z-10 -mt-12 -mb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-(--contact-bar-bg) rounded-lg py-5 px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <PhoneIcon sx={{ fontSize: 32, color: "var(--footer-pink)" }} />
                <div>
                  <p className="text-sm text-(--footer-pink)">Give us a call</p>
                  <p className="text-lg font-semibold">{CONTACT_INFO.phone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <EmailIcon sx={{ fontSize: 32, color: "var(--footer-pink)" }} />
                <div>
                  <p className="text-sm text-(--footer-pink)">
                    Send Us A Message
                  </p>
                  <p className="text-lg font-semibold">{CONTACT_INFO.email}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <LocationOnIcon
                  sx={{ fontSize: 32, color: "var(--footer-pink)" }}
                />
                <div>
                  <p className="text-sm text-(--footer-pink)">Location</p>
                  <p className="text-lg font-semibold">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
