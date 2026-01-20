"use client";

import Link from "next/link";
import { pizzas } from "@/lib/data";

export default function FeaturedPizzas() {
  const featuredPizza = pizzas[0]; // All Seasoned Pizza

  return (
    <section className="bg-linear-to-b from-[#FFF5E6] to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-[#5D3A1A] mb-4">
            Our Customers&apos; favourites
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-2">
            These are most loved choices by our lovely customers.
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Make a delicious choice and never regret it.
          </p>
          <p className="text-gray-600 mt-4">
            Get the best pizza in town right at your doorstep with just a few
            clicks.
          </p>
        </div>

        {/* Featured Pizza Card */}
        <div className="grid gap-8 md:grid-cols-2 items-center max-w-5xl mx-auto">
          {/* Pizza Image */}
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
            <div className="absolute top-4 left-4 z-10">
              <button
                className="rounded-full bg-[#E5D4C1] p-2 shadow-md hover:bg-[#d4c3b0] transition-colors"
                aria-label="Add to cart"
              >
                <svg
                  className="h-5 w-5 text-[#5D3A1A]"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
            {/* Placeholder - replace with actual image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Pizza Image
            </div>
          </div>

          {/* Pizza Details */}
          <div>
            <h3 className="font-display text-3xl sm:text-4xl text-[#5D3A1A] mb-4">
              {featuredPizza.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-sm text-gray-600">Start from</span>
              <span className="text-3xl font-bold text-[#5D3A1A]">
                ${featuredPizza.price}
              </span>
            </div>

            {/* Toppings */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {featuredPizza.toppings.slice(0, 7).map(topping => (
                  <span
                    key={topping}
                    className="rounded-full border border-[#8B5A2B] px-3 py-1 text-sm text-[#5D3A1A]"
                  >
                    {topping}
                  </span>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href={`/product/${featuredPizza.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5D4C1] px-8 py-3 text-base font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] transition-colors"
            >
              CHECKOUT
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Other Featured Pizzas Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.slice(1, 4).map(pizza => (
            <Link
              key={pizza.id}
              href={`/product/${pizza.id}`}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Add to Cart Icon */}
              <div className="absolute top-4 left-4 z-10">
                <button
                  className="rounded-full bg-[#E5D4C1] p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Add ${pizza.name} to cart`}
                  onClick={e => {
                    e.preventDefault();
                    // Handle add to cart
                  }}
                >
                  <svg
                    className="h-5 w-5 text-[#5D3A1A]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>

              {/* Pizza Image */}
              <div className="relative aspect-square bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Pizza Image
                </div>
              </div>

              {/* Pizza Info */}
              <div className="p-4 text-center">
                <h4 className="font-display text-xl text-[#5D3A1A] mb-2">
                  {pizza.name}
                </h4>
                <p className="text-lg font-semibold text-[#5D3A1A]">
                  ${pizza.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/store"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#5D3A1A] px-8 py-3 text-base font-medium text-[#5D3A1A] hover:bg-[#5D3A1A] hover:text-white transition-colors"
          >
            Go to our store
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
          </Link>
        </div>
      </div>
    </section>
  );
}
