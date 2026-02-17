import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/app/actions/orders";
import { getCurrentUser } from "@/lib/auth";
import { SaveOrderInfoModal } from "@/components/SaveOrderInfoModal";
import { Button } from "@/components/ui";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HomeIcon from "@mui/icons-material/Home";

export const metadata: Metadata = {
  title: "Order Confirmed - Moshzion Pizza",
  description:
    "Your order has been confirmed. Thank you for choosing Moshzion Pizza!"
};
import type { OrderItem } from "@/types";

interface OrderConfirmationPageProps {
  searchParams: { orderId?: string };
}

export default async function OrderConfirmationPage({
  searchParams
}: OrderConfirmationPageProps) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    redirect("/store");
  }

  const result = await getOrderById(orderId);

  if (!result.success || !result.order) {
    redirect("/store");
  }

  const order = result.order;
  const items = order.items as unknown as OrderItem[];
  const user = await getCurrentUser();

  // Show save modal only for guest orders
  const showSaveModal = !order.userId;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon sx={{ fontSize: 48 }} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl text-brown-dark mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 font-open-sans text-lg">
            Thank you for your order. We&apos;ll start preparing it right away!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg border border-brown-dark/10 p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-brown-dark/10">
            <div>
              <p className="text-sm text-gray-600 font-open-sans">Order ID</p>
              <p className="font-display text-xl text-brown-dark">
                #{order.id.slice(0, 8)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-open-sans">
                Order Status
              </p>
              <p className="font-display text-xl text-orange-600">
                {order.status}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="font-display text-xl text-brown-dark mb-4">
              Order Items
            </h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-display text-lg text-brown-dark">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 font-open-sans">
                      {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-display text-lg text-brown-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-beige-light rounded-lg p-4 space-y-2">
            <div className="flex justify-between font-open-sans">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-brown-dark">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-open-sans">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-brown-dark">
                ${order.deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-open-sans">
              <span className="text-gray-600">Tax</span>
              <span className="text-brown-dark">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-display text-xl pt-2 border-t border-brown-dark/20">
              <span className="text-brown-dark">Total</span>
              <span className="text-brown-dark">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg border border-brown-dark/10 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <LocalShippingIcon className="text-brown-dark" />
            <h2 className="font-display text-xl text-brown-dark">
              Delivery Information
            </h2>
          </div>
          {order.address ? (
            <div className="font-open-sans text-gray-700">
              <p className="font-semibold text-brown-dark mb-1">
                {order.address.label}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}
                {order.address.state && `, ${order.address.state}`}
              </p>
              {order.address.zipCode && <p>{order.address.zipCode}</p>}
            </div>
          ) : order.guestAddress ? (
            <div className="font-open-sans text-gray-700">
              <p className="font-semibold text-brown-dark mb-1">
                {order.guestName}
              </p>
              <p>{order.guestAddress}</p>
              <p>{order.guestPhone}</p>
            </div>
          ) : (
            <p className="text-gray-600 font-open-sans">
              No delivery information available
            </p>
          )}
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg border border-brown-dark/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptIcon className="text-brown-dark" />
            <h2 className="font-display text-xl text-brown-dark">
              Payment Status
            </h2>
          </div>
          <p className="font-open-sans text-gray-700">
            <span className="font-semibold">Status: </span>
            <span
              className={
                order.paymentStatus === "PAID"
                  ? "text-green-600"
                  : "text-orange-600"
              }
            >
              {order.paymentStatus}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {user && (
            <Link href="/orders" className="flex-1">
              <Button
                variant="primary"
                color="beige"
                className="w-full"
                icon={<ReceiptIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                View All Orders
              </Button>
            </Link>
          )}
          <Link href="/" className="flex-1">
            <Button
              variant="primary"
              color="brown"
              className="w-full"
              icon={<HomeIcon sx={{ fontSize: 20 }} />}
              iconPosition="left"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Save Order Info Modal for Guest Users */}
      {showSaveModal && (
        <SaveOrderInfoModal
          orderId={order.id}
          guestName={order.guestName || ""}
          guestPhone={order.guestPhone || ""}
          guestAddress={order.guestAddress || ""}
        />
      )}
    </div>
  );
}
