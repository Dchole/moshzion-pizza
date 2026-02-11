import { getCart } from "@/app/actions/cart";
import { EmptyCartState } from "@/components/EmptyCartState";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getUserProfile } from "@/lib/auth";
import { getUserAddresses } from "@/lib/address-actions";
import { getUserPaymentMethods } from "@/lib/payment-actions";

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return <EmptyCartState />;
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get user data if authenticated
  const user = await getUserProfile();
  let userData = null;
  let defaultAddress = null;
  let hasCreditCard = false;

  if (user) {
    // Get default address
    const addresses = await getUserAddresses();
    defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

    // Check if user has credit card saved
    const paymentMethods = await getUserPaymentMethods();
    hasCreditCard = paymentMethods.some(pm => pm.type === "Card");

    userData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      address: defaultAddress
        ? `${defaultAddress.street}, ${defaultAddress.city}${defaultAddress.state ? `, ${defaultAddress.state}` : ""}`
        : ""
    };
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            Checkout
          </h1>
        </div>

        <CheckoutForm
          items={cart.items}
          totalPrice={totalPrice}
          userData={userData}
          hasCreditCard={hasCreditCard}
          userId={user?.id}
        />
      </div>
    </div>
  );
}
