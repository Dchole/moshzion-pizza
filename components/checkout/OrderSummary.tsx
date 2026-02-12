/**
 * Order Summary Component for Checkout
 * Displays cart items and pricing breakdown
 */

import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  onRemoveItem?: (itemId: string) => void;
  showRemoveButtons?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  onRemoveItem,
  showRemoveButtons = false
}: OrderSummaryProps) {
  return (
    <div className="rounded-lg border-2 border-brown-medium/20 p-6 bg-secondary-beige/50 sticky top-6">
      <h2 className="font-display text-2xl text-brown-dark mb-4">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {items.map(item => (
          <div
            key={item.id}
            className="flex gap-3 pb-4 border-b border-brown-medium/10 last:border-0"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-brown-dark text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600">{item.size}</p>
                  {item.toppings.length > 0 && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {item.toppings.join(", ")}
                    </p>
                  )}
                </div>

                {showRemoveButtons && onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="shrink-0 p-1 hover:bg-red-100 rounded-full transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <CloseIcon sx={{ fontSize: 16, color: "#dc2626" }} />
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600">
                  Qty: {item.quantity}
                </span>
                <span className="font-semibold text-brown-dark text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 text-sm border-t border-brown-medium/20 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-brown-medium/20">
          <span className="font-display text-xl text-brown-dark">Total</span>
          <span className="font-display text-xl text-brown-dark">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
