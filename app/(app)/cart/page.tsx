import { getCart } from "@/app/actions/cart";
import Link from "next/link";
import { CartItems } from "@/components/CartItems";

export default async function CartPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
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

          <h1 className="font-display text-4xl text-brown-dark mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Add an item from the store</p>

          <Link
            href="/store"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-brown-dark hover:bg-(--primary-beige-hover) transition-colors"
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

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            Shopping Cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItems items={cart.items} />
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sticky top-4">
              <h2 className="font-display text-2xl text-brown-dark mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>$5.00</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-2xl text-brown-dark mb-6">
                <span>Total</span>
                <span>${(totalPrice + 5).toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-lg bg-primary px-6 py-3 text-center font-medium text-brown-dark hover:bg-(--primary-beige-hover) transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/store"
                className="block w-full mt-3 rounded-lg border-2 border-brown-dark px-6 py-3 text-center font-medium text-brown-dark hover:bg-brown-dark hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
