"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { pizzas } from "@/lib/data";
import { Button } from "@/components/ui";
import type { PizzaSize } from "@/types";

const calculatePrice = (basePrice: number, multiplier: number): number => {
  return Math.round(basePrice * multiplier);
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pizza = pizzas.find(p => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState<PizzaSize["name"]>("Small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const toggleTopping = useCallback((topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  }, []);

  const handleAddToCart = useCallback(() => {
    // TODO: Implement actual cart logic
    console.log("Add to cart:", { pizza, selectedSize, selectedToppings });
  }, [pizza, selectedSize, selectedToppings]);

  const handleCheckout = useCallback(() => {
    // TODO: Implement actual checkout logic
    router.push("/checkout");
  }, [router]);

  if (!pizza) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pizza not found
          </h1>
          <Link
            href="/store"
            className="text-brown-medium hover:text-brown-dark hover:underline transition-colors"
          >
            Return to store
          </Link>
        </div>
      </div>
    );
  }

  const selectedSizeData = pizza.sizes.find(s => s.name === selectedSize)!;
  const finalPrice = calculatePrice(
    pizza.price,
    selectedSizeData.priceMultiplier
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
            {pizza.image ? (
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                Pizza Image
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-4xl sm:text-5xl text-brown-dark mb-4">
              {pizza.name}
            </h1>
            <p className="text-3xl font-bold text-brown-dark mb-6">
              ${finalPrice}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed font-open-sans">
              {pizza.description}
            </p>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-open-sans">
                Select Size
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {pizza.sizes.map(size => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`rounded-lg border-2 p-4 text-center transition-colors font-open-sans ${
                      selectedSize === size.name
                        ? "border-brown-dark bg-beige-light"
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-open-sans">
                Toppings
              </h2>
              <div className="flex flex-wrap gap-2">
                {pizza.toppings.map(topping => (
                  <button
                    key={topping}
                    onClick={() => toggleTopping(topping)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium font-open-sans transition-colors ${
                      selectedToppings.includes(topping)
                        ? "border-brown-dark bg-brown-dark text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-brown-medium"
                    }`}
                    aria-pressed={selectedToppings.includes(topping)}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                color="brown"
                className="flex-1"
                icon={<ShoppingCartIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                ADD TO CART
              </Button>

              <Button
                onClick={handleCheckout}
                variant="primary"
                color="beige"
                className="flex-1"
                icon={<ShoppingCartIcon sx={{ fontSize: 20 }} />}
              >
                CHECKOUT
              </Button>
            </div>

            <div className="mt-8 hidden md:block">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors font-open-sans"
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
                Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
