"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical global error
    console.error("[CRITICAL]", error.message, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #f5f0e8, #ffffff)",
            padding: "1rem",
            fontFamily: "system-ui, sans-serif"
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              border: "2px solid rgba(139, 90, 43, 0.2)",
              padding: "3rem 2rem",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 2rem",
                borderRadius: "50%",
                background: "rgba(139, 90, 43, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem"
              }}
              role="img"
              aria-label="Error"
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: "2.5rem",
                color: "#5d3a1a",
                marginBottom: "1rem",
                fontWeight: "bold"
              }}
            >
              Something Went Wrong
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                color: "#4b5563",
                marginBottom: "2rem",
                lineHeight: "1.6"
              }}
            >
              We apologize for the inconvenience. Our team has been notified and
              is working to fix the issue.
            </p>

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#e5d4c1",
                  color: "#2d1b0e",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#d4c3b0";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#e5d4c1";
                }}
              >
                Try Again
              </button>

              <Link
                href="/"
                style={{
                  padding: "0.75rem 2rem",
                  background: "white",
                  color: "#5d3a1a",
                  border: "2px solid #8b5a2b",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "background 0.2s"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#f5f0e8";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "white";
                }}
              >
                Back to Home
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && error.message && (
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  background: "#fef2f2",
                  border: "1px solid #fee2e2",
                  borderRadius: "0.5rem",
                  textAlign: "left"
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#991b1b",
                    fontFamily: "monospace",
                    wordBreak: "break-all"
                  }}
                >
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
