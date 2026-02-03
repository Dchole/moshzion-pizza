"use client";

import { useEffect, useState } from "react";
import { getCartSummary } from "@/app/actions/cart";

export function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadCount() {
      const { totalItems } = await getCartSummary();
      setCount(totalItems);
    }
    loadCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCount();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brown-medium text-xs font-bold text-white">
      {count}
    </span>
  );
}
