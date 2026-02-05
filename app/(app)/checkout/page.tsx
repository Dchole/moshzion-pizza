import { getCart } from "@/app/actions/cart";
import Image from "next/image";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Button } from "@/components/ui";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="relative h-64 w-full">
              <Image
                src="/assets/Empty Cart.svg"
                alt="Empty Cart"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="font-display text-4xl text-brown-dark mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Add an item from the store</p>

          <Button
            href="/store"
            variant="primary"
            color="beige"
            icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
            iconPosition="right"
          >
            Go to Store
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            Checkout
          </h1>
        </div>

        <CheckoutForm items={cart.items} totalPrice={totalPrice} />
      </div>
    </div>
  );
}
