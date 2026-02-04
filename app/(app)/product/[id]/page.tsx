"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import { pizzas } from "@/lib/data";
import { FEATURED_CONFIG } from "@/lib/constants";
import { Button, Chip } from "@/components/ui";
import type { PizzaSize } from "@/types";

const calculatePrice = (basePrice: number, multiplier: number): number => {
  return Math.round(basePrice * multiplier);
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pizza = pizzas.find(p => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState<PizzaSize["name"]>("Small");

  const handleAddToCart = useCallback(() => {
    // TODO: Implement actual cart logic
    console.log("Add to cart:", { pizza, selectedSize });
  }, [pizza, selectedSize]);

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

  // Check if this is the featured pizza with a discount
  const hasDiscount = pizza.id === FEATURED_CONFIG.pizzaId;
  const originalPrice = hasDiscount
    ? calculatePrice(
        FEATURED_CONFIG.originalPrice,
        selectedSizeData.priceMultiplier
      )
    : null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:py-8">
          <div className="relative aspect-square overflow-hidden bg-gray-200 lg:rounded-lg">
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

          <div className="px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
            <h1 className="font-display text-5xl sm:text-6xl text-brown-dark mb-2">
              {pizza.name}
            </h1>
            {hasDiscount && originalPrice ? (
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-xl text-gray-500 line-through">
                  ${originalPrice}
                </span>
                <span className="font-display text-2xl text-brown-dark">
                  ${finalPrice}
                </span>
              </div>
            ) : (
              <p className="font-display text-2xl text-brown-dark mb-6">
                ${finalPrice}
              </p>
            )}

            <p className="text-gray-700 mb-8 leading-relaxed font-open-sans">
              {pizza.description}
            </p>

            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-3 font-open-sans">
                Select Size
              </h2>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {pizza.sizes.map(size => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`rounded-lg border-2 p-3 text-center transition-colors font-open-sans ${
                      selectedSize === size.name
                        ? "border-brown-dark bg-[#BCE7FF]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    aria-pressed={selectedSize === size.name}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {size.name}
                    </div>
                    <div className="text-xs text-gray-600">{size.size}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-3 font-open-sans">
                Toppings
              </h2>
              <div className="flex flex-wrap gap-2">
                {pizza.toppings.map(topping => (
                  <Chip key={topping} label={topping} variant="outline" />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                color="brown"
                className="flex-1"
                icon={<AddShoppingCartIcon sx={{ fontSize: 20 }} />}
                iconPosition="right"
              >
                ADD TO CART
              </Button>

              <Button
                onClick={handleCheckout}
                variant="primary"
                color="beige"
                className="flex-1"
                icon={<PaymentIcon sx={{ fontSize: 20 }} />}
                iconPosition="right"
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
