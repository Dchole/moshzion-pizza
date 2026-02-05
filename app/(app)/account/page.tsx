"use client";

import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Button } from "@/components/ui";

export default function AccountPage() {
  // TODO: Fetch user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: null
  };

  const savedAddresses = [
    {
      id: "1",
      label: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      isDefault: true
    },
    {
      id: "2",
      label: "Work",
      street: "456 Office Park",
      city: "New York",
      state: "NY",
      zip: "10002",
      isDefault: false
    }
  ];

  const paymentMethods = [
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "5555",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            My Account
          </h1>
          <p className="mt-2 text-gray-600 font-open-sans">
            Manage your profile, addresses, and payment methods
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Section */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-labelledby="profile-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PersonIcon className="text-brown-dark" />
                <h2
                  id="profile-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Profile Information
                </h2>
              </div>
              <button
                className="rounded-lg p-2 text-brown-dark hover:bg-gray-100 transition-colors"
                aria-label="Edit profile"
              >
                <EditIcon fontSize="small" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 font-open-sans">
                  Full Name
                </label>
                <p className="mt-1 text-gray-900 font-open-sans">{user.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 font-open-sans">
                  Email Address
                </label>
                <p className="mt-1 text-gray-900 font-open-sans">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 font-open-sans">
                  Phone Number
                </label>
                <p className="mt-1 text-gray-900 font-open-sans">
                  {user.phone}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-labelledby="quick-actions-heading"
          >
            <div className="mb-4">
              <h2
                id="quick-actions-heading"
                className="font-display text-2xl text-brown-dark"
              >
                Quick Actions
              </h2>
            </div>

            <div className="space-y-3">
              <Button
                href="/orders"
                variant="outline"
                color="brown"
                className="w-full justify-start"
                icon={<ReceiptIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                View Order History
              </Button>

              <Button
                href="/track-order"
                variant="outline"
                color="brown"
                className="w-full justify-start"
                icon={<LocalShippingIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Track My Order
              </Button>

              <Button
                href="/store"
                variant="primary"
                color="beige"
                className="w-full justify-start"
                icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Start New Order
              </Button>
            </div>
          </section>

          {/* Saved Addresses */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-labelledby="addresses-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocationOnIcon className="text-brown-dark" />
                <h2
                  id="addresses-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Saved Addresses
                </h2>
              </div>
              <Button
                variant="outline"
                color="brown"
                size="sm"
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                iconPosition="left"
                onClick={() => {
                  /* TODO: Open add address modal */
                }}
              >
                Add Address
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {savedAddresses.map(address => (
                <div
                  key={address.id}
                  className="rounded-lg border border-gray-200 p-4 relative"
                >
                  {address.isDefault && (
                    <span className="absolute top-2 right-2 rounded-full bg-beige-light px-3 py-1 text-xs font-medium text-brown-dark font-open-sans">
                      Default
                    </span>
                  )}

                  <h3 className="font-display text-lg text-brown-dark mb-2">
                    {address.label}
                  </h3>

                  <address className="not-italic text-sm text-gray-600 font-open-sans">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zip}
                  </address>

                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors font-open-sans"
                      aria-label={`Edit ${address.label} address`}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${address.label} address`}
                      disabled={address.isDefault}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Methods */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-labelledby="payment-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PaymentIcon className="text-brown-dark" />
                <h2
                  id="payment-heading"
                  className="font-display text-2xl text-brown-dark"
                >
                  Payment Methods
                </h2>
              </div>
              <Button
                variant="outline"
                color="brown"
                size="sm"
                icon={<AddIcon sx={{ fontSize: 18 }} />}
                iconPosition="left"
                onClick={() => {
                  /* TODO: Open add payment method modal */
                }}
              >
                Add Card
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="rounded-lg border border-gray-200 p-4 relative"
                >
                  {method.isDefault && (
                    <span className="absolute top-2 right-2 rounded-full bg-beige-light px-3 py-1 text-xs font-medium text-brown-dark font-open-sans">
                      Default
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded bg-gray-100 p-2">
                      <PaymentIcon className="text-brown-dark" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-brown-dark">
                        {method.type} •••• {method.last4}
                      </h3>
                      <p className="text-sm text-gray-600 font-open-sans">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors font-open-sans"
                      aria-label={`Edit ${method.type} ending in ${method.last4}`}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Remove ${method.type} ending in ${method.last4}`}
                      disabled={method.isDefault}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Account Settings */}
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
            aria-labelledby="settings-heading"
          >
            <div className="mb-4 flex items-center gap-2">
              <SettingsIcon className="text-brown-dark" />
              <h2
                id="settings-heading"
                className="font-display text-2xl text-brown-dark"
              >
                Account Settings
              </h2>
            </div>

            <div className="space-y-4">
              <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 font-open-sans">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600 font-open-sans">
                    Update your password to keep your account secure
                  </p>
                </div>
                <EditIcon className="text-gray-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 font-open-sans">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-gray-600 font-open-sans">
                    Manage your email and SMS notifications
                  </p>
                </div>
                <EditIcon className="text-gray-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900 font-open-sans">
                    Privacy Settings
                  </h3>
                  <p className="text-sm text-gray-600 font-open-sans">
                    Control your data and privacy preferences
                  </p>
                </div>
                <EditIcon className="text-gray-400" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
