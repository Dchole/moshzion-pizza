import { getCart } from "@/app/actions/cart";
import PaymentIcon from "@mui/icons-material/Payment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { CartItems } from "@/components/CartItems";
import { EmptyCartState } from "@/components/EmptyCartState";
import { Button } from "@/components/ui";

export default async function CartPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return <EmptyCartState />;
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            Shopping Cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItems items={cart.items} />
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-4">
              <h2 className="font-display text-2xl text-brown-dark mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>$5.00</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-2xl text-brown-dark mb-6">
                <span>Total</span>
                <span>${(totalPrice + 5).toFixed(2)}</span>
              </div>

              <Button
                href="/checkout"
                variant="primary"
                color="beige"
                className="w-full mb-3"
                icon={<PaymentIcon sx={{ fontSize: 20 }} />}
                iconPosition="right"
              >
                Proceed to Checkout
              </Button>

              <Button
                href="/store"
                variant="outline"
                color="brown"
                className="w-full"
                icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
                iconPosition="right"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
