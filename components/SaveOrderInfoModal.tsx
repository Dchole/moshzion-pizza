"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Alert } from "@/components/ui";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface SaveOrderInfoModalProps {
  orderId: string;
  guestName: string;
  guestPhone: string;
  guestAddress: string;
}

export function SaveOrderInfoModal({
  orderId,
  guestName,
  guestPhone,
  guestAddress
}: SaveOrderInfoModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSave = () => {
    setShowPasswordField(true);
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/save-guest-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            phone: guestPhone,
            name: guestName,
            address: guestAddress
          })
        });

        const result = await response.json();

        if (result.success) {
          setShowModal(false);
          router.refresh();
        } else {
          setError(result.message || "Failed to save information");
        }
      } catch {
        setError("An error occurred. Please try again.");
      }
    });
  };

  return (
    <Modal
      open={showModal}
      onClose={handleSkip}
      title="Save Your Information"
      maxWidth="md"
    >
      <div className="space-y-6">
        <div>
          <p className="text-gray-600 font-open-sans">
            We&apos;ll save your order details for faster checkouts next time.
            Create an account to track your orders and manage your information.
          </p>
        </div>

        {!showPasswordField ? (
          <div className="space-y-4">
            <div className="bg-beige-light rounded-lg p-4 space-y-2 font-open-sans text-sm">
              <div>
                <span className="text-gray-600">Name: </span>
                <span className="text-brown-dark font-semibold">
                  {guestName}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Phone: </span>
                <span className="text-brown-dark font-semibold">
                  {guestPhone}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Address: </span>
                <span className="text-brown-dark font-semibold">
                  {guestAddress}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="primary"
                color="beige"
                onClick={handleSave}
                className="flex-1"
                icon={<SaveIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                Save Information
              </Button>
              <Button
                type="button"
                variant="primary"
                color="brown"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 font-open-sans">
                <strong>Note:</strong> Your account will be created. You can
                sign in anytime using OTP verification sent to{" "}
                <strong>{guestPhone}</strong>.
              </p>
            </div>

            {error && <Alert variant="error" message={error} />}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="primary"
                color="beige"
                className="flex-1"
                disabled={isPending}
                icon={<SaveIcon sx={{ fontSize: 20 }} />}
                iconPosition="left"
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
              <Button
                type="button"
                variant="primary"
                color="brown"
                onClick={() => setShowPasswordField(false)}
                className="flex-1"
                disabled={isPending}
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
