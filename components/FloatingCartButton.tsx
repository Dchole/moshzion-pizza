"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { CartCount } from "@/components/CartCount";
import { UI_TIMING, SCROLL_THRESHOLDS } from "@/lib/constants";

interface AddedItem {
  name: string;
  image: string;
  price: number;
}

interface AddedItemWithCount extends AddedItem {
  count: number;
}

export function FloatingCartButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAddedItems, setShowAddedItems] = useState(false);
  const [addedItems, setAddedItems] = useState<AddedItemWithCount[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLDS.floatingCartButton);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AddedItem>;

      if (customEvent.detail) {
        const newItem = customEvent.detail;

        setAddedItems(prev => {
          const existingIndex = prev.findIndex(
            item => item.name === newItem.name
          );

          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              count: updated[existingIndex].count + 1
            };
            return updated;
          } else {
            return [...prev, { ...newItem, count: 1 }];
          }
        });

        setShowAddedItems(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setShowAddedItems(false);
          setTimeout(() => {
            setAddedItems([]);
          }, UI_TIMING.cartNotificationCollapseDuration);
        }, UI_TIMING.cartNotificationDuration);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`sticky bottom-0 right-0 z-50 ml-auto w-fit transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center gap-1 rounded-tl-xl bg-primary border-2 border-primary border-r-0 border-b-0 p-1 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]">
        <Link
          href="/cart"
          className="relative flex items-center justify-center rounded-md p-2 hover:bg-[#E8D7C3] transition-colors"
          aria-label="Shopping cart"
        >
          <LocalMallIcon sx={{ fontSize: 20, color: "var(--text-dark)" }} />
          <CartCount />
        </Link>

        <div
          className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ${
            showAddedItems ? `pr-2` : "w-0"
          }`}
          style={{
            width: showAddedItems ? `${addedItems.length * 36 + 8}px` : "0px"
          }}
        >
          {addedItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className={`relative h-8 w-8 shrink-0 transition-transform duration-300 ${
                showAddedItems ? "scale-100" : "scale-0"
              }`}
            >
              <div className="relative h-full w-full rounded-md overflow-hidden border-2 border-brown-dark">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              {item.count > 1 && (
                <div className="absolute -top-1 -right-1 bg-brown-dark text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm">
                  +{item.count}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
