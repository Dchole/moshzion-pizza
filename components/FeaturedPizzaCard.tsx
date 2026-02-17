"use client";

import { Pizza } from "@/types";
import { FEATURED_CONFIG } from "@/lib/constants";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Chip } from "@/components/ui";
import { AddToCartButton } from "@/components/AddToCartButton";
import Link from "next/link";
import Image from "next/image";

interface FeaturedPizzaCardProps {
  pizza: Pizza;
  variant?: "hero" | "compact";
  className?: string;
}

export function FeaturedPizzaCard({
  pizza,
  variant = "hero",
  className = ""
}: FeaturedPizzaCardProps) {
  if (variant === "compact") {
    return (
      <div
        className={`sm:col-span-2 rounded-lg border border-[#D4C4B0] bg-linear-to-br from-[#FDF8F3] to-[#F5EFE7] p-4 shadow-md h-full ${className}`}
      >
        <div className="grid grid-cols-[minmax(200px,300px)_1fr] gap-4 h-full">
          <div className="relative h-full min-h-70 w-full bg-gray-200 rounded-lg overflow-hidden group">
            <div className="absolute top-0 left-0 z-10">
              <AddToCartButton
                pizza={{
                  id: pizza.id,
                  name: pizza.name,
                  price: pizza.price,
                  image: pizza.image
                }}
                variant="filled"
                color="white"
                size="md"
                icon={
                  <AddShoppingCartIcon
                    sx={{ fontSize: 20, color: "var(--brown-dark)" }}
                  />
                }
              />
            </div>
            {pizza.image ? (
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 200px, 300px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Pizza Image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between py-2">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl text-brown-dark mb-2">
                {pizza.name}
              </h2>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl lg:text-2xl text-(--price-strikethrough) line-through font-display">
                  ${FEATURED_CONFIG.originalPrice}
                </span>
                <span className="text-xl lg:text-2xl font-display text-(--price-color)">
                  ${pizza.price}
                </span>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {pizza.toppings.map(topping => (
                  <Chip key={topping} label={topping} />
                ))}
              </div>
            </div>

            <Link
              href={`/product/${pizza.id}`}
              className="inline-flex items-center gap-1 text-base font-medium font-open-sans text-brown-medium hover:text-brown-dark transition-colors"
            >
              Click to view details
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid gap-8 md:grid-cols-2 items-center max-w-5xl mx-auto">
        <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
          <div className="absolute top-0 left-0 z-10">
            <AddToCartButton
              pizza={{
                id: pizza.id,
                name: pizza.name,
                price: pizza.price,
                image: pizza.image
              }}
              variant="filled"
              color="white"
              size="lg"
              icon={
                <AddShoppingCartIcon
                  sx={{ fontSize: 28, color: "var(--brown-dark)" }}
                />
              }
            />
          </div>
          {pizza.image ? (
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Pizza Image
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display text-4xl sm:text-5xl text-brown-dark mb-4">
            {pizza.name} ✨
          </h3>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl text-(--price-strikethrough) line-through font-display">
              ${FEATURED_CONFIG.originalPrice}
            </span>
            <span className="text-3xl font-display text-(--price-color)">
              ${pizza.price}
            </span>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {pizza.toppings
                .slice(0, FEATURED_CONFIG.maxToppingsDisplay)
                .map(topping => (
                  <Chip key={topping} label={topping} />
                ))}
            </div>
          </div>

          <Link
            href={`/product/${pizza.id}`}
            className="inline-flex items-center gap-1 text-base font-medium font-open-sans text-brown-medium hover:text-brown-dark transition-colors"
          >
            Click to view details
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
