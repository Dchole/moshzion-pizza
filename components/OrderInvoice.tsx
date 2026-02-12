"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { IconButton } from "@/components/ui/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import type { OrderItem } from "@/types";

interface OrderInvoiceProps {
  order: {
    id: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    items: unknown;
    user?: {
      firstName: string | null;
      lastName: string | null;
      phone: string;
    } | null;
    address?: {
      label: string;
      street: string;
      city: string;
      state: string | null;
      zipCode: string | null;
    } | null;
    guestName: string | null;
    guestPhone: string | null;
    guestAddress: string | null;
  };
}

export function OrderInvoice({ order }: OrderInvoiceProps) {
  const [showInvoice, setShowInvoice] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const items = order.items as unknown as OrderItem[];

  return (
    <>
      <Button
        variant="primary"
        color="beige"
        className="w-full"
        onClick={() => setShowInvoice(true)}
        icon={<PrintIcon sx={{ fontSize: 20 }} />}
        iconPosition="left"
      >
        View Invoice
      </Button>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between print:hidden">
              <h2 className="font-display text-2xl text-brown-dark">Invoice</h2>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  color="beige"
                  onClick={handlePrint}
                  icon={<PrintIcon sx={{ fontSize: 20 }} />}
                >
                  Print
                </Button>
                <IconButton
                  onClick={() => setShowInvoice(false)}
                  icon={<CloseIcon />}
                  aria-label="Close invoice"
                  variant="ghost"
                  color="brown"
                  size="md"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8 print:p-12">
              {/* Company Header */}
              <div className="text-center mb-8">
                <h1 className="font-display text-4xl text-brown-dark mb-2">
                  Moshzion Pizza
                </h1>
                <p className="text-gray-600 font-open-sans">
                  Authentic Italian Pizza · Made with Love
                </p>
                <p className="text-sm text-gray-500 font-open-sans mt-2">
                  123 Pizza Street, Food City, FC 12345
                </p>
                <p className="text-sm text-gray-500 font-open-sans">
                  Phone: (555) 123-4567 · Email: info@moshzionpizza.com
                </p>
              </div>

              <div className="border-t-2 border-brown-dark my-6" />

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-display text-lg text-brown-dark mb-3">
                    Invoice To:
                  </h3>
                  {order.user ? (
                    <div className="font-open-sans text-gray-700">
                      <p className="font-semibold">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p>{order.user.phone}</p>
                      {order.address && (
                        <>
                          <p className="mt-2">{order.address.street}</p>
                          <p>
                            {order.address.city}
                            {order.address.state && `, ${order.address.state}`}
                          </p>
                          {order.address.zipCode && (
                            <p>{order.address.zipCode}</p>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="font-open-sans text-gray-700">
                      <p className="font-semibold">{order.guestName}</p>
                      <p>{order.guestPhone}</p>
                      <p className="mt-2">{order.guestAddress}</p>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <h3 className="font-display text-lg text-brown-dark mb-3">
                    Invoice Details:
                  </h3>
                  <div className="font-open-sans text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">Invoice #:</span>{" "}
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p>
                      <span className="font-semibold">Order Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="text-orange-600 uppercase">
                        {order.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Payment Status:</span>{" "}
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
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-brown-dark">
                      <th className="text-left py-3 font-display text-brown-dark">
                        Item
                      </th>
                      <th className="text-center py-3 font-display text-brown-dark">
                        Size
                      </th>
                      <th className="text-center py-3 font-display text-brown-dark">
                        Qty
                      </th>
                      <th className="text-right py-3 font-display text-brown-dark">
                        Price
                      </th>
                      <th className="text-right py-3 font-display text-brown-dark">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-4 pr-4">
                          <p className="font-open-sans text-brown-dark font-semibold">
                            {item.name}
                          </p>
                          {item.toppings && item.toppings.length > 0 && (
                            <p className="text-sm text-gray-600 font-open-sans mt-1">
                              {item.toppings.join(", ")}
                            </p>
                          )}
                        </td>
                        <td className="py-4 text-center font-open-sans text-gray-700">
                          {item.size}
                        </td>
                        <td className="py-4 text-center font-open-sans text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-right font-open-sans text-gray-700">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-open-sans text-gray-700 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between font-open-sans text-gray-700">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-open-sans text-gray-700">
                      <span>Delivery Fee:</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-open-sans text-gray-700">
                      <span>Tax (10%):</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-brown-dark pt-2 mt-2">
                      <div className="flex justify-between font-display text-2xl text-brown-dark">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-open-sans text-sm mb-2">
                  Thank you for your business!
                </p>
                <p className="text-gray-500 font-open-sans text-xs">
                  For any inquiries, please contact us at info@moshzionpizza.com
                  or call (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-12,
          .print\\:p-12 * {
            visibility: visible;
          }
          .print\\:p-12 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
