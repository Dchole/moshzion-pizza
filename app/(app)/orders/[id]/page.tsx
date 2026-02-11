import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/app/actions/orders";
import { Button } from "@/components/ui";
import { OrderInvoice } from "@/components/OrderInvoice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import type { OrderItem } from "@/types";

interface OrderDetailsPageProps {
  params: { id: string };
}

export default async function OrderDetailsPage({
  params
}: OrderDetailsPageProps) {
  const result = await getOrderById(params.id);

  if (!result.success || !result.order) {
    redirect("/orders");
  }

  const order = result.order;
  const items = order.items as unknown as OrderItem[];

  function getStatusColor(status: string) {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800";
      case "CONFIRMED":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  }

  function formatStatus(status: string) {
    return status
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }

  const orderTimeline = [
    { status: "PENDING", label: "Order Placed", completed: true },
    {
      status: "CONFIRMED",
      label: "Confirmed",
      completed: [
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
      ].includes(order.status)
    },
    {
      status: "PREPARING",
      label: "Preparing",
      completed: ["PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
        order.status
      )
    },
    {
      status: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      completed: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status)
    },
    {
      status: "DELIVERED",
      label: "Delivered",
      completed: order.status === "DELIVERED"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders">
            <Button
              variant="primary"
              color="brown"
              icon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
            >
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-3xl text-brown-dark">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600 font-open-sans text-sm mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-open-sans text-sm font-semibold ${getStatusColor(order.status)}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            {order.status !== "CANCELLED" && (
              <div className="bg-white rounded-lg shadow-sm border border-brown-dark/10 p-6">
                <h2 className="font-display text-xl text-brown-dark mb-6">
                  Order Progress
                </h2>
                <div className="space-y-4">
                  {orderTimeline.map((step, index) => (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.completed ? (
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {index < orderTimeline.length - 1 && (
                          <div
                            className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                              step.completed ? "bg-green-300" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-open-sans font-semibold ${
                            step.completed ? "text-brown-dark" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-brown-dark/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ReceiptIcon className="text-brown-dark" />
                <h2 className="font-display text-xl text-brown-dark">
                  Order Items
                </h2>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-display text-lg text-brown-dark mb-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 font-open-sans mb-1">
                        Size: {item.size}
                      </p>
                      {item.toppings && item.toppings.length > 0 && (
                        <p className="text-sm text-gray-600 font-open-sans">
                          Toppings: {item.toppings.join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 font-open-sans mt-2">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-display text-lg text-brown-dark">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-brown-dark/10">
                <div className="space-y-2">
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
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="text-brown-dark">
                      ${order.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-display text-xl pt-3 border-t border-brown-dark/20">
                    <span className="text-brown-dark">Total</span>
                    <span className="text-brown-dark">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-brown-dark/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <LocalShippingIcon className="text-brown-dark" />
                <h2 className="font-display text-lg text-brown-dark">
                  Delivery Info
                </h2>
              </div>
              {order.address ? (
                <div className="font-open-sans text-gray-700">
                  <p className="font-semibold text-brown-dark mb-2">
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
                  <p className="font-semibold text-brown-dark mb-2">
                    {order.guestName}
                  </p>
                  <p>{order.guestAddress}</p>
                  <p className="mt-2">{order.guestPhone}</p>
                </div>
              ) : (
                <p className="text-gray-600 font-open-sans">
                  No delivery information available
                </p>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-brown-dark/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <PaymentIcon className="text-brown-dark" />
                <h2 className="font-display text-lg text-brown-dark">
                  Payment Info
                </h2>
              </div>
              <div className="space-y-2 font-open-sans">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === "PAID"
                        ? "text-green-600"
                        : order.paymentStatus === "FAILED"
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Print Invoice */}
            <OrderInvoice order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
