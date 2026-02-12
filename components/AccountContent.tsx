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
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneVerification } from "./account/PhoneVerification";
import { ProfileEditableField } from "./account/ProfileEditableField";
import { AddressFormModal } from "./AddressFormModal";
import { PaymentMethodFormModal } from "./PaymentMethodFormModal";
import { getUserAddresses, deleteAddress } from "@/lib/address-actions";
import {
  getUserPaymentMethods,
  deletePaymentMethod
} from "@/lib/payment-actions";
import { ConfirmDialog } from "@/components/ui";
import { PAYMENT_TYPES } from "@/lib/config";

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

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  isDefault: boolean;
}

interface PaymentMethodType {
  id: string;
  type: string;
  provider: string;
  last4: string;
  fullPhone?: string | null;
  name?: string | null;
  isDefault: boolean;
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

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodType | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<Address[] | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethodType[] | null
  >(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const isAuthenticated = !!user;

  const isLoadingAddresses = isAuthenticated && savedAddresses === null;
  const isLoadingPayments = isAuthenticated && paymentMethods === null;

  useEffect(() => {
    if (isAuthenticated) {
      getUserAddresses().then(setSavedAddresses);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      getUserPaymentMethods().then(setPaymentMethods);
    }
  }, [isAuthenticated]);

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

  // Address handlers
  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Address",
      message:
        "Are you sure you want to delete this address? This action cannot be undone.",
      onConfirm: async () => {
        const result = await deleteAddress(addressId);
        if (result.success) {
          setSavedAddresses(prev =>
            (prev || []).filter(a => a.id !== addressId)
          );
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAddressFormSuccess = async () => {
    const addresses = await getUserAddresses();
    setSavedAddresses(addresses);
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsPaymentModalOpen(true);
  };

  const handleEditPayment = (payment: PaymentMethodType) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleDeletePayment = async (paymentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Payment Method",
      message:
        "Are you sure you want to remove this payment method? This action cannot be undone.",
      onConfirm: async () => {
        const result = await deletePaymentMethod(paymentId);
        if (result.success) {
          setPaymentMethods(prev =>
            (prev || []).filter(p => p.id !== paymentId)
          );
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePaymentFormSuccess = async () => {
    const methods = await getUserPaymentMethods();
    setPaymentMethods(methods);
  };

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
            className="rounded-lg border border-gray-200 bg-white p-6"
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
            className="rounded-lg border border-gray-200 bg-white p-6"
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
            className="rounded-lg border border-gray-200 bg-white p-6 lg:col-span-2"
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
                onClick={handleAddAddress}
              >
                Add Address
              </Button>
            </div>

            {isLoadingAddresses ? (
              <div className="text-center py-8">
                <p className="text-gray-600 font-open-sans">
                  Loading addresses...
                </p>
              </div>
            ) : (savedAddresses || []).length === 0 ? (
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
                {savedAddresses?.map(address => (
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
                      {address.city}
                      {address.state && `, ${address.state}`} {address.zipCode}
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
                        onClick={() => handleEditAddress(address)}
                      >
                        Edit
                      </Button>
                      <IconButton
                        variant="ghost"
                        aria-label={`Delete ${address.label} address`}
                        icon={<DeleteOutlineIcon fontSize="small" />}
                        onClick={() => handleDeleteAddress(address.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section
            className="rounded-lg border border-gray-200 bg-white p-6 lg:col-span-2"
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
                onClick={handleAddPayment}
              >
                Add Payment Method
              </Button>
            </div>

            {isLoadingPayments ? (
              <div className="text-center py-8">
                <p className="text-gray-600 font-open-sans">
                  Loading payment methods...
                </p>
              </div>
            ) : (paymentMethods || []).length === 0 ? (
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
                {paymentMethods?.map(method => (
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
                          {method.type === PAYMENT_TYPES.MOBILE_MONEY &&
                          method.fullPhone
                            ? method.fullPhone
                            : `${method.type} •••• ${method.last4}`}
                        </h3>
                        <p className="text-sm text-gray-600 font-open-sans">
                          {method.provider}
                          {method.name && ` • ${method.name}`}
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
                        onClick={() => handleEditPayment(method)}
                      >
                        Edit
                      </Button>
                      <IconButton
                        variant="ghost"
                        aria-label={`Remove ${method.type} ending in ${method.last4}`}
                        icon={<DeleteOutlineIcon fontSize="small" />}
                        onClick={() => handleDeletePayment(method.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modals */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={selectedAddress}
        onSuccess={handleAddressFormSuccess}
      />

      <PaymentMethodFormModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentMethod={selectedPayment}
        onSuccess={handlePaymentFormSuccess}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
