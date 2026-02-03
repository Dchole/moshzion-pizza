"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
// import Image from "next/image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="relative h-48 w-48">
              <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <ellipse
                  cx="100"
                  cy="140"
                  rx="80"
                  ry="20"
                  fill="#FFE5D9"
                  opacity="0.5"
                />
                <path
                  d="M60 80 L140 80 L150 120 L50 120 Z"
                  fill="#E5D4C1"
                  stroke="#5D3A1A"
                  strokeWidth="3"
                />
                <circle cx="70" cy="130" r="8" fill="#5D3A1A" />
                <circle cx="130" cy="130" r="8" fill="#5D3A1A" />
                <path
                  d="M100 60 L100 90 M85 75 L115 75"
                  stroke="#D4A574"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <h1 className="font-display text-4xl text-[#5D3A1A] mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Add an item from the store</p>

          <Link
            href="/store"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5D4C1] px-8 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl sm:text-4xl text-[#5D3A1A]">
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear shopping cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                      Pizza
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-xl text-[#5D3A1A]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            ${item.price} · {item.size}
                            {item.toppings.length > 0 &&
                              ` · ${item.toppings.length} toppings`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          aria-label="Remove item"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-3 flex gap-2">
                        {["S", "M", "L", "M+"].map(size => (
                          <button
                            key={size}
                            className={`rounded border px-3 py-1 text-sm ${
                              item.size.charAt(0) === size.charAt(0) ||
                              (size === "M+" && item.size === "Mega")
                                ? "border-[#5D3A1A] bg-[#FFF5E6] text-[#5D3A1A]"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="rounded-full border border-gray-300 p-1 hover:bg-gray-50"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="rounded-full border border-gray-300 p-1 hover:bg-gray-50"
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-[#5D3A1A]">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-semibold text-gray-900 mb-6">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E5D4C1] px-6 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Checkout - ${totalPrice}
              </Link>

              <Link
                href="/store"
                className="mt-3 block text-center text-sm text-[#8B5A2B] hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
