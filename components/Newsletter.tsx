"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setEmail("");
    setIsSubmitting(false);
    alert("Thank you for subscribing!");
  };

  return (
    <section
      id="newsletter"
      className="bg-linear-to-br from-[#8B2E2E] to-[#5D1F1F] py-16 sm:py-24 text-white"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl mb-6">
          Get Notified
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl mx-auto">
          Get up to date with our services, Get notified when we have new deals
          and updates to our store and services.
        </p>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="email-newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="email-newsletter"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="yourname@email.com"
              className="flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#E5D4C1]"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#E5D4C1] px-8 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
