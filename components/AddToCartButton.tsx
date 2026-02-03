"use client";

import { useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { IconButton } from "@/components/ui";
import type { CartItem } from "@/types";

interface AddToCartButtonProps {
  pizza: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  variant?: "filled";
  color?: "white" | "beige";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
  className?: string;
}

export function AddToCartButton({
  pizza,
  variant = "filled",
  color = "beige",
  size = "md",
  icon,
  className = ""
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const cartItem: Omit<CartItem, "id"> = {
        pizzaId: pizza.id,
        name: pizza.name,
        price: pizza.price,
        size: "Medium",
        toppings: [],
        quantity: 1,
        image: pizza.image
      };

      await addToCart(cartItem);

      // Trigger event for cart count to update
      window.dispatchEvent(new Event("cart-updated"));
    });
  };

  return (
    <IconButton
      variant={variant}
      color={color}
      size={size}
      icon={icon}
      aria-label={`Add ${pizza.name} to cart`}
      onClick={handleAddToCart}
      disabled={isPending}
      className={className}
    />
  );
}
