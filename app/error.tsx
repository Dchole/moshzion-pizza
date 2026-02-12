"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Button } from "@/components/ui";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring (in production, this would go to error tracking service)
    if (typeof window !== "undefined") {
      console.error("[ERROR]", error.message, { digest: error.digest });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-beige to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-brown-medium/20 p-8 md:p-12">
          {/* Pizza Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-brown-light/20 to-brown-medium/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <ReportProblemIcon
                sx={{ fontSize: 64, color: "var(--brown-medium)" }}
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl text-brown-dark text-center mb-4">
            Oops! Something Burned
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-700 text-center mb-8 font-open-sans">
            We're sorry, but something went wrong while preparing your order.
            Don't worry, your cart is safe!
          </p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div
              className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <h2 className="font-semibold text-red-800 mb-2 text-sm">
                Error Details (Development Only):
              </h2>
              <p className="text-red-700 text-sm font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-600 text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              variant="primary"
              color="beige"
              icon={<RefreshIcon sx={{ fontSize: 20 }} />}
              iconPosition="left"
              className="justify-center"
            >
              Try Again
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                color="brown"
                icon={<HomeIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
                className="w-full justify-center"
              >
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center font-open-sans">
              If this problem persists, please{" "}
              <Link
                href="/contacts"
                className="text-brown-medium hover:text-brown-dark underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-medium focus-visible:ring-offset-2"
              >
                contact our support team
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center">
          <nav aria-label="Quick navigation">
            <ul className="flex flex-wrap justify-center gap-4 text-sm">
              <li>
                <Link
                  href="/store"
                  className="text-brown-medium hover:text-brown-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-medium focus-visible:ring-offset-2 rounded"
                >
                  Browse Menu
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                •
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-brown-medium hover:text-brown-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-medium focus-visible:ring-offset-2 rounded"
                >
                  My Orders
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">
                •
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-brown-medium hover:text-brown-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-medium focus-visible:ring-offset-2 rounded"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
