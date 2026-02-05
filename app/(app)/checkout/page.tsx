import { getCart } from "@/app/actions/cart";
import { EmptyCartState } from "@/components/EmptyCartState";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return <EmptyCartState />;
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
