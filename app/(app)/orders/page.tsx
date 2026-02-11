import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserOrders } from "@/app/actions/orders";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { OrderItem } from "@/types";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/account");
  }

  const result = await getUserOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-brown-dark mb-6">
            My Orders
          </h1>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 font-open-sans">
              Failed to load orders. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const orders = result.orders || [];

  function getStatusIcon(status: string) {
    switch (status) {
      case "DELIVERED":
        return <CheckCircleIcon className="text-green-600" />;
      case "CANCELLED":
        return <CancelIcon className="text-red-600" />;
      case "OUT_FOR_DELIVERY":
        return <LocalShippingIcon className="text-blue-600" />;
      default:
        return <AccessTimeIcon className="text-orange-600" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      case "OUT_FOR_DELIVERY":
        return "text-blue-600";
      case "PREPARING":
        return "text-purple-600";
      default:
        return "text-orange-600";
    }
  }

  function formatStatus(status: string) {
    return status
      .split("_")
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="font-display text-4xl text-brown-dark mb-4 sm:mb-0">
            My Orders
          </h1>
          <Link
            href="/store"
            className="text-brown-dark hover:text-brown-medium font-open-sans font-medium transition-colors flex items-center gap-2 hover:underline underline-offset-2"
          >
            Continue Shopping
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-brown-dark/10 p-12 text-center">
            <ReceiptIcon
              sx={{ fontSize: 80 }}
              className="text-gray-300 mb-4 mx-auto"
            />
            <h2 className="font-display text-2xl text-brown-dark mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 font-open-sans mb-6">
              Start ordering delicious pizzas and they&apos;ll appear here.
            </p>
            <Link href="/store">
              <Button
                variant="primary"
                color="brown"
                icon={<ShoppingBagIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Order Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const items = order.items as unknown as OrderItem[];
              const itemCount = items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-lg border border-brown-dark/10 hover:border-brown-dark/20 transition-colors p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="mt-1">
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1">
                            <h3 className="font-sans text-xl text-brown-dark font-semibold">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <span
                              className={`font-sans text-sm font-semibold ${getStatusColor(order.status)}`}
                            >
                              {formatStatus(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-open-sans mb-2">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )}
                          </p>
                          <p className="text-gray-700 font-open-sans">
                            {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                            {items
                              .slice(0, 2)
                              .map(item => item.name)
                              .join(", ")}
                            {items.length > 2 && ` +${items.length - 2} more`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between lg:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-sans mb-1">
                          Total
                        </p>
                        <p className="font-display text-2xl text-brown-dark">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-brown-dark">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
