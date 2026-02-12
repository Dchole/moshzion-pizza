"use client";

import { useTransition } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-brown-dark disabled:opacity-50 transition-colors"
        >
          <DeleteOutlineIcon sx={{ fontSize: 20 }} />
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
              <Link
                href={`/product/${item.pizzaId}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/product/${item.pizzaId}`}>
                        <h3 className="font-display text-xl text-brown-dark hover:text-brown-medium transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        ${item.price} · {item.size}
                        {item.toppings.length > 0 &&
                          ` · ${item.toppings.length} toppings`}
                      </p>
                    </div>
                    <IconButton
                      onClick={() => handleRemove(item.id)}
                      disabled={isPending}
                      icon={<CloseIcon sx={{ fontSize: 20 }} />}
                      aria-label="Remove item"
                      variant="ghost"
                      color="brown"
                      size="sm"
                      className="rounded-full"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={isPending || item.quantity <= 1}
                      icon={<RemoveIcon sx={{ fontSize: 18 }} />}
                      aria-label="Decrease quantity"
                      variant="ghost"
                      color="brown"
                      size="sm"
                      className="rounded-full bg-gray-100"
                    />
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={isPending}
                      icon={<AddIcon sx={{ fontSize: 18 }} />}
                      aria-label="Increase quantity"
                      variant="ghost"
                      color="brown"
                      size="sm"
                      className="rounded-full bg-gray-100"
                    />
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
