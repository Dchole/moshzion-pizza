"use client";

import { useEffect, useState, useRef } from "react";
import { getCartSummary } from "@/app/actions/cart";

export function CartCount() {
  const [count, setCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadCount() {
      const { totalItems } = await getCartSummary();
      setCount(totalItems);
    }
    loadCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Wait for the animation to finish before updating count
      // 2000ms for display + 300ms for collapse animation
      timeoutRef.current = setTimeout(() => {
        loadCount();
      }, 2300);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brown-medium text-xs font-bold text-white">
      {count}
    </span>
  );
}
