"use client";

import { useState } from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
    <>
      <section
        id="newsletter"
        className="bg-[#8B2E2E] py-16 sm:py-20 pb-24 text-white"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Header */}
          <h2 className="font-display text-5xl sm:text-6xl mb-6 text-[#FFDBDB]">
            Get Notified
          </h2>
          <p className="text-lg text-[#E9C6C3] mb-8 max-w-lg mx-auto">
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
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full rounded-sm border border-gray-400 bg-[#6B2222] px-4 py-3 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-[#E5D4C1] focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-sm border border-gray-300 bg-white px-10 py-2.5 font-medium text-[#8B2E2E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Bar - Floating (hidden on mobile) */}
      <div className="hidden sm:block relative z-10 -mt-12 -mb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#5A4543] rounded-lg py-5 px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <PhoneIcon sx={{ fontSize: 32, color: "#FFA9A9" }} />
                <div>
                  <p className="text-sm text-[#FFA9A9]">Give us a call</p>
                  <p className="text-lg font-semibold">(023) 456 7890</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <EmailIcon sx={{ fontSize: 32, color: "#FFA9A9" }} />
                <div>
                  <p className="text-sm text-[#FFA9A9]">Send Us A Message</p>
                  <p className="text-lg font-semibold">contact@email.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <LocationOnIcon sx={{ fontSize: 32, color: "#FFA9A9" }} />
                <div>
                  <p className="text-sm text-[#FFA9A9]">Location</p>
                  <p className="text-lg font-semibold">
                    Fire Cabin, Mint st. 15
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
