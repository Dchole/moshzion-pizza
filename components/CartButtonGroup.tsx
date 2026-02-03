"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PersonIcon from "@mui/icons-material/Person";
import { CartCount } from "@/components/CartCount";

interface AddedItem {
  name: string;
  image: string;
  price: number;
}

interface CartButtonGroupProps {
  showAccount?: boolean;
  onAccountClick?: () => void;
}

export function CartButtonGroup({
  showAccount = true,
  onAccountClick
}: CartButtonGroupProps) {
  const [showAddedItem, setShowAddedItem] = useState(false);
  const [addedItem, setAddedItem] = useState<AddedItem | null>(null);

  useEffect(() => {
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AddedItem>;

      if (customEvent.detail) {
        setAddedItem(customEvent.detail);
        setShowAddedItem(true);

        setTimeout(() => {
          setShowAddedItem(false);
        }, 2000);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  return (
    <div
      className={`flex items-center gap-1 rounded-xl bg-white border-2 border-primary p-1 transition-all duration-300`}
    >
      <Link
        href="/cart"
        className="relative flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors"
        aria-label="Shopping cart"
      >
        <LocalMallIcon sx={{ fontSize: 20, color: "var(--text-dark)" }} />
        <CartCount />
      </Link>

      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ${showAddedItem ? "w-10 pr-2" : "w-0"}`}
      >
        {addedItem && (
          <div
            className={`relative h-8 w-8 rounded-md overflow-hidden shrink-0 border-2 border-primary transition-transform duration-300 ${showAddedItem ? "scale-100" : "scale-0"}`}
          >
            <Image
              src={addedItem.image}
              alt={addedItem.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        )}
      </div>

      {showAccount &&
        (onAccountClick ? (
          <button
            className="flex items-center justify-center rounded-md bg-primary p-2 hover:bg-(--primary-beige-hover) transition-colors"
            aria-label="Open menu"
            onClick={onAccountClick}
          >
            <PersonIcon sx={{ fontSize: 20, color: "var(--text-dark)" }} />
          </button>
        ) : (
          <Link
            href="/account"
            className="flex items-center justify-center rounded-md bg-primary p-2 hover:bg-(--primary-beige-hover) transition-colors"
            aria-label="User account"
          >
            <PersonIcon sx={{ fontSize: 20, color: "var(--text-dark)" }} />
          </Link>
        ))}
    </div>
  );
}
