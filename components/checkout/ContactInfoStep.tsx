/**
 * Contact Information Step for Checkout
 * Collects guest/user contact details before payment
 */

import { Input, Alert } from "@/components/ui";

interface ContactInfoStepProps {
  contactInfo: {
    name: string;
    phone: string;
    address: string;
  };
  error: string | null;
  isPending: boolean;
}

export function ContactInfoStep({
  contactInfo,
  error,
  isPending
}: ContactInfoStepProps) {
  return (
    <div className="space-y-6 rounded-lg p-4 lg:p-6">
      <h2 className="font-display text-2xl text-brown-dark mb-4">
        Contact Information
      </h2>

      {error && <Alert variant="error" message={error} />}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="guestName"
            className="block text-sm font-medium text-brown-dark mb-2"
          >
            Full Name *
          </label>
          <Input
            type="text"
            id="guestName"
            name="guestName"
            required
            defaultValue={contactInfo.name}
            placeholder="John Doe"
            disabled={isPending}
            aria-required="true"
          />
        </div>

        <div>
          <label
            htmlFor="guestPhone"
            className="block text-sm font-medium text-brown-dark mb-2"
          >
            Phone Number *
          </label>
          <Input
            type="tel"
            id="guestPhone"
            name="guestPhone"
            required
            defaultValue={contactInfo.phone}
            placeholder="0241234567"
            pattern="0[235]\d{8}"
            disabled={isPending}
            aria-required="true"
            aria-describedby="phone-help"
          />
          <p id="phone-help" className="text-xs text-gray-600 mt-1">
            Enter a valid Ghana phone number (10 digits)
          </p>
        </div>

        <div>
          <label
            htmlFor="guestAddress"
            className="block text-sm font-medium text-brown-dark mb-2"
          >
            Delivery Address *
          </label>
          <textarea
            id="guestAddress"
            name="guestAddress"
            required
            defaultValue={contactInfo.address}
            rows={3}
            className="w-full px-4 py-3 border border-brown-medium/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-medium focus:border-transparent bg-white resize-none"
            placeholder="House number, street, area, landmark..."
            disabled={isPending}
            aria-required="true"
          />
        </div>
      </div>
    </div>
  );
}
