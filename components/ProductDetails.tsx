"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import { addToCart } from "@/app/actions/cart";
import { Button, Chip } from "@/components/ui";
import type { Pizza, PizzaSize } from "@/types";

interface ProductDetailsProps {
  pizza: Pizza;
  hasDiscount: boolean;
  originalPrice: number | null;
}

const calculatePrice = (basePrice: number, multiplier: number): number => {
  return Math.round(basePrice * multiplier);
};

export function ProductDetails({
  pizza,
  hasDiscount,
  originalPrice
}: ProductDetailsProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize["name"]>("Small");

  const selectedSizeData = pizza.sizes.find(s => s.name === selectedSize);
  const finalPrice =
    pizza && selectedSizeData
      ? calculatePrice(pizza.price, selectedSizeData.priceMultiplier)
      : 0;

  const handleAddToCart = async () => {
    if (!pizza || !selectedSizeData) return;

    await addToCart({
      pizzaId: pizza.id,
      name: pizza.name,
      price: finalPrice,
      size: selectedSize,
      toppings: pizza.toppings,
      quantity: 1,
      image: pizza.image
    });

    window.dispatchEvent(
      new CustomEvent("cart-updated", {
        detail: {
          name: pizza.name,
          image: pizza.image,
          price: finalPrice
        }
      })
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const displayOriginalPrice =
    hasDiscount && originalPrice && selectedSizeData
      ? calculatePrice(originalPrice, selectedSizeData.priceMultiplier)
      : null;

  return (
    <>
      <h1 className="font-display text-5xl sm:text-6xl text-brown-dark mb-2">
        {pizza.name}
      </h1>
      {displayOriginalPrice ? (
        <div className="flex items-baseline gap-2 mb-6">
          <span className="font-display text-xl text-gray-500 line-through">
            ${displayOriginalPrice}
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
        <h2 className="sr-only">Select Size</h2>
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
        <h2 className="font-display text-2xl text-brown-dark mb-3">Toppings</h2>
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
    </>
  );
}
