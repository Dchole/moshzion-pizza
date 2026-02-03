"use client";

import { useTransition } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/types";

interface CartItemsProps {
  items: CartItem[];
}

export function CartItems({ items }: CartItemsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = (itemId: string) => {
    startTransition(async () => {
      await removeFromCart(itemId);
      router.refresh();
      window.dispatchEvent(new Event("cart-updated"));
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(itemId, quantity);
      router.refresh();
      window.dispatchEvent(new Event("cart-updated"));
    });
  };

  const handleClearCart = () => {
    startTransition(async () => {
      await clearCart();
      router.refresh();
      window.dispatchEvent(new Event("cart-updated"));
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleClearCart}
          disabled={isPending}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
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

      <div className="space-y-4">
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
                      <h3 className="font-display text-xl text-brown-dark">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ${item.price} · {item.size}
                        {item.toppings.length > 0 &&
                          ` · ${item.toppings.length} toppings`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
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
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={isPending || item.quantity <= 1}
                      className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
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
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={isPending}
                      className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
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

                  <div className="font-display text-xl text-brown-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
