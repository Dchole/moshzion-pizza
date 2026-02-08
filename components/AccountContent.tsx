"use client";

import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton } from "@/components/ui";
import { signOutUser } from "@/lib/auth-actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PhoneVerification } from "./account/PhoneVerification";
import { ProfileEditableField } from "./account/ProfileEditableField";

interface User {
  id: string;
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
  isPhoneVerified?: boolean | null;
  phoneVerifiedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AccountContentProps {
  user: User | null;
}

export function AccountContent({ user }: AccountContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingField, setEditingField] = useState<
    "firstName" | "lastName" | "phone" | null
  >(null);

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutUser();
    });
  };

  const handleEditField = (field: "firstName" | "lastName" | "phone") => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleSuccess = () => {
    setEditingField(null);
    setTimeout(() => {
      router.refresh();
    }, 500);
  };

  const isAuthenticated = !!user;

  // Mock data (will be replaced with real data from DB)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedAddresses: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentMethods: any[] = [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-brown-dark">
            My Account
          </h1>
          <p className="mt-2 text-gray-600 font-open-sans">
            {isAuthenticated
              ? "Manage your profile, addresses, and payment methods"
              : "Sign in or create an account with your phone number"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            aria-labelledby="profile-heading"
          >
            <div className="mb-4 flex items-center gap-2">
              <PersonIcon className="text-brown-dark" />
              <h2
                id="profile-heading"
                className="font-display text-2xl text-brown-dark"
              >
                Profile Information
              </h2>
            </div>

            <div className="space-y-4">
              {!isAuthenticated ? (
                <PhoneVerification
                  isPending={isPending}
                  startTransition={startTransition}
                />
              ) : (
                <>
                  <ProfileEditableField
                    label="Phone Number"
                    field="phone"
                    value={user?.phone || ""}
                    isEditing={editingField === "phone"}
                    isPending={isPending}
                    onEdit={() => handleEditField("phone")}
                    onCancel={handleCancelEdit}
                    onSuccess={handleSuccess}
                    startTransition={startTransition}
                  />

                  <ProfileEditableField
                    label="First Name"
                    field="firstName"
                    value={user?.firstName || ""}
                    isEditing={editingField === "firstName"}
                    isPending={isPending}
                    onEdit={() => handleEditField("firstName")}
                    onCancel={handleCancelEdit}
                    onSuccess={handleSuccess}
                    startTransition={startTransition}
                  />

                  <ProfileEditableField
                    label="Last Name"
                    field="lastName"
                    value={user?.lastName || ""}
                    isEditing={editingField === "lastName"}
                    isPending={isPending}
                    onEdit={() => handleEditField("lastName")}
                    onCancel={handleCancelEdit}
                    onSuccess={handleSuccess}
                    startTransition={startTransition}
                  />
                </>
              )}
            </div>
          </section>
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

              {isAuthenticated && (
                <Button
                  variant="outline"
                  color="brown"
                  className="w-full justify-start"
                  icon={<LogoutIcon sx={{ fontSize: 20 }} />}
                  iconPosition="left"
                  onClick={handleSignOut}
                  disabled={isPending}
                >
                  {isPending ? "Signing out..." : "Sign Out"}
                </Button>
              )}
            </div>
          </section>

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
                disabled={!isAuthenticated}
              >
                Add Address
              </Button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="text-center py-8">
                <LocationOnIcon
                  className="mx-auto text-gray-300 mb-3"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-gray-600 font-open-sans">
                  {isAuthenticated
                    ? "No addresses saved yet. Add one to get started!"
                    : "Sign in to save delivery addresses"}
                </p>
              </div>
            ) : (
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
                      <Button
                        variant="outline"
                        color="brown"
                        size="sm"
                        className="flex-1"
                        icon={<EditIcon fontSize="small" />}
                        iconPosition="left"
                        aria-label={`Edit ${address.label} address`}
                      >
                        Edit
                      </Button>
                      <IconButton
                        className="border border-red-300 text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${address.label} address`}
                        disabled={address.isDefault}
                        icon={<DeleteOutlineIcon fontSize="small" />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
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
                disabled={!isAuthenticated}
              >
                Add Card
              </Button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <PaymentIcon
                  className="mx-auto text-gray-300 mb-3"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-gray-600 font-open-sans">
                  {isAuthenticated
                    ? "No payment methods saved yet. Add one for faster checkout!"
                    : "Sign in to save payment methods"}
                </p>
              </div>
            ) : (
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
                      <Button
                        variant="outline"
                        color="brown"
                        size="sm"
                        className="flex-1"
                        icon={<EditIcon fontSize="small" />}
                        iconPosition="left"
                        aria-label={`Edit ${method.type} ending in ${method.last4}`}
                      >
                        Edit
                      </Button>
                      <IconButton
                        className="border border-red-300 text-red-600 hover:bg-red-50"
                        aria-label={`Remove ${method.type} ending in ${method.last4}`}
                        disabled={method.isDefault}
                        icon={<DeleteOutlineIcon fontSize="small" />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
