import Link from "next/link";
import Image from "next/image";
import { Pizza } from "@/types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { AddToCartButton } from "@/components/AddToCartButton";

interface PizzaCardProps {
  pizza: Pizza;
  className?: string;
}

export function PizzaCard({ pizza, className = "" }: PizzaCardProps) {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute -top-1 -left-1 z-10">
        <AddToCartButton
          pizza={{
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            image: pizza.image
          }}
          variant="filled"
          color="beige"
          size="md"
          icon={
            <AddShoppingCartIcon
              sx={{ fontSize: 20, color: "var(--brown-dark)" }}
            />
          }
        />
      </div>

      <Link href={`/product/${pizza.id}`}>
        <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
          {pizza.image ? (
            <Image
              src={pizza.image}
              alt={pizza.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Pizza Image
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 text-center">
        <h3 className="font-display text-2xl text-brown-dark mb-1">
          {pizza.name}
        </h3>
        <p className="text-lg font-display text-(--price-color)">
          ${pizza.price}
        </p>
      </div>
    </div>
  );
}

export default PizzaCard;
