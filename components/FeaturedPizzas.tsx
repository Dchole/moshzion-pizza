"use client";

import Link from "next/link";
import { pizzas } from "@/lib/data";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import StorefrontIcon from "@mui/icons-material/Storefront";

export default function FeaturedPizzas() {
  const featuredPizza = pizzas[0]; // All Seasoned Pizza

  return (
    <section
      id="featured"
      className="bg-linear-to-b from-[#FFF5E6] to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#5D3A1A] mb-4">
            Our Customers&apos; favourites
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-2 leading-tight text-left sm:text-center">
            These are most loved choices by our lovely customers.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto text-left sm:text-center">
            Make a delicious choice and never regret it.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 mt-6 max-w-lg mx-auto text-left sm:text-center">
            Get the best pizza in town right at your doorstep with just a few
            clicks.
          </p>
        </div>

        {/* Featured Pizza Card */}
        <div className="grid gap-8 md:grid-cols-2 items-center max-w-5xl mx-auto">
          {/* Pizza Image */}
          <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
            <div className="absolute top-0 left-0 z-10">
              <button
                className="bg-white p-3 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Add to cart"
              >
                <AddShoppingCartIcon sx={{ fontSize: 28, color: "#5D3A1A" }} />
              </button>
            </div>
            {/* Placeholder - replace with actual image */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Pizza Image
            </div>
          </div>

          {/* Pizza Details */}
          <div>
            <h3 className="font-display text-4xl sm:text-5xl text-[#5D3A1A] mb-4">
              All Seasoned Pizza ✨
            </h3>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl text-[#C4B8A8] line-through font-display">
                $80
              </span>
              <span className="text-3xl font-display text-[#836F6F]">
                ${featuredPizza.price}
              </span>
            </div>

            {/* Toppings */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {featuredPizza.toppings.slice(0, 7).map(topping => (
                  <span
                    key={topping}
                    className="rounded-md border border-[#817D59] bg-[#F0EEDE] px-3 py-1 text-sm text-[#4B4611]"
                  >
                    {topping}
                  </span>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href={`/product/${featuredPizza.id}`}
              className="inline-flex items-center justify-center gap-3 rounded-md bg-[#E5D4C1] px-12 py-4 text-base font-semibold tracking-wider text-[#5D3A1A] hover:bg-[#d4c3b0] transition-colors"
            >
              CHECKOUT
              <ShoppingCartCheckoutIcon
                sx={{ fontSize: 22, color: "#5D3A1A" }}
              />
            </Link>
          </div>
        </div>

        {/* Other Featured Pizzas Grid */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.slice(1, 4).map(pizza => (
            <div key={pizza.id} className="group relative">
              {/* Add to Cart Icon */}
              <div className="absolute -top-3 -left-3 z-10">
                <button
                  className="bg-[#E5D4C1] p-2 shadow-md hover:bg-[#d4c3b0] transition-colors"
                  aria-label={`Add ${pizza.name} to cart`}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle add to cart
                  }}
                >
                  <AddShoppingCartIcon
                    sx={{ fontSize: 20, color: "#5D3A1A" }}
                  />
                </button>
              </div>

              {/* Pizza Image */}
              <Link href={`/product/${pizza.id}`}>
                <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Pizza Image
                  </div>
                </div>
              </Link>

              {/* Pizza Info */}
              <div className="mt-4 text-center">
                <h4 className="font-display text-2xl text-[#5D3A1A] mb-1">
                  {pizza.name}
                </h4>
                <p className="text-lg font-display text-[#836F6F]">
                  ${pizza.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/store"
            className="group inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#5D3A1A] px-8 py-3 text-base font-medium text-[#5D3A1A] hover:bg-[#5D3A1A] hover:text-white transition-colors"
          >
            Go to our store
            <StorefrontIcon
              className="group-hover:text-white"
              sx={{ fontSize: 20, color: "#5D3A1A" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
