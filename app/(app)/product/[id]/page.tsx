"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { pizzas } from "@/lib/data";
import type { PizzaSize } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const pizza = pizzas.find(p => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState<PizzaSize["name"]>("Small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  if (!pizza) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pizza not found
          </h1>
          <Link href="/store" className="text-[#8B5A2B] hover:underline">
            Return to store
          </Link>
        </div>
      </div>
    );
  }

  const selectedSizeData = pizza.sizes.find(s => s.name === selectedSize)!;
  const finalPrice = Math.round(pizza.price * selectedSizeData.priceMultiplier);

  const toggleTopping = (topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    // TODO: Handle add to cart logic
    alert(`Added ${pizza.name} (${selectedSize}) to cart!`);
  };

  const handleCheckout = () => {
    // TODO: Handle direct checkout
    alert(`Proceeding to checkout with ${pizza.name} (${selectedSize})`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-14 z-30 bg-[#E5D4C1] px-4 py-3 md:hidden">
        <Link href="/store" className="flex items-center gap-2 text-[#5D3A1A]">
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
              Pizza Image
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl sm:text-5xl text-[#5D3A1A] mb-4">
              {pizza.name}
            </h1>
            <p className="text-3xl font-bold text-[#5D3A1A] mb-6">
              ${finalPrice}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {pizza.description}
            </p>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Size
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {pizza.sizes.map(size => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`rounded-lg border-2 p-4 text-center transition-colors ${
                      selectedSize === size.name
                        ? "border-[#5D3A1A] bg-[#FFF5E6]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    aria-pressed={selectedSize === size.name}
                  >
                    <div className="font-semibold text-gray-900">
                      {size.name}
                    </div>
                    <div className="text-sm text-gray-600">{size.size}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Toppings
              </h2>
              <div className="flex flex-wrap gap-2">
                {pizza.toppings.map(topping => (
                  <button
                    key={topping}
                    onClick={() => toggleTopping(topping)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedToppings.includes(topping)
                        ? "border-[#5D3A1A] bg-[#5D3A1A] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-[#8B5A2B]"
                    }`}
                    aria-pressed={selectedToppings.includes(topping)}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#5D3A1A] bg-white px-6 py-3 font-medium text-[#5D3A1A] hover:bg-gray-50 transition-colors"
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
                ADD TO CART
              </button>

              <button
                onClick={handleCheckout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E5D4C1] px-6 py-3 font-medium text-[#5D3A1A] hover:bg-[#d4c3b0] transition-colors"
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
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>

            <div className="mt-8 hidden md:block">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 text-[#8B5A2B] hover:underline"
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
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
