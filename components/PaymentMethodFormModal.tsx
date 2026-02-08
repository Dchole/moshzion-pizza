"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
	addPaymentMethod,
	updatePaymentMethod,
} from "@/lib/payment-actions";

interface PaymentMethod {
	id: string;
	type: string;
	provider: string;
	last4: string;
	fullPhone?: string | null;
	name?: string | null;
	isDefault: boolean;
}

interface PaymentMethodFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	paymentMethod?: PaymentMethod | null;
	onSuccess?: () => void;
}

const MOBILE_MONEY_PROVIDERS = ["MTN", "Vodafone", "AirtelTigo"];

export function PaymentMethodFormModal({
	isOpen,
	onClose,
	paymentMethod,
	onSuccess,
}: PaymentMethodFormModalProps) {
	const [formData, setFormData] = useState<{
		type: "Mobile Money" | "Card";
		provider: string;
		last4: string;
		fullPhone: string;
		name: string;
		isDefault: boolean;
	}>({
		type: (paymentMethod?.type as "Mobile Money" | "Card") || "Mobile Money",
		provider: paymentMethod?.provider || "",
		last4: paymentMethod?.last4 || "",
		fullPhone: paymentMethod?.fullPhone || "",
		name: paymentMethod?.name || "",
		isDefault: paymentMethod?.isDefault || false,
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate last4
		if (formData.last4.length !== 4) {
			setError("Last 4 digits must be exactly 4 characters");
			return;
		}

		setLoading(true);

		try {
			const result = paymentMethod
				? await updatePaymentMethod(paymentMethod.id, formData)
				: await addPaymentMethod(formData);

			if (result.success) {
				onSuccess?.();
				onClose();
				// Reset form
				setFormData({
					type: "Mobile Money",
					provider: "",
					last4: "",
					fullPhone: "",
					name: "",
					isDefault: false,
				});
			} else {
				setError(result.error || "Failed to save payment method");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">
						{paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
					</h2>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Type <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.type}
								onChange={(e) => {
									setFormData({
										...formData,
										type: e.target.value as "Mobile Money" | "Card",
										provider: "", // Reset provider when type changes
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="Mobile Money">Mobile Money</option>
								<option value="Card">Card</option>
							</select>
						</div>

						{formData.type === "Mobile Money" ? (
							<>
								<div>
									<label className="block text-sm font-medium mb-1">
										Provider <span className="text-red-500">*</span>
									</label>
									<select
										value={formData.provider}
										onChange={(e) =>
											setFormData({ ...formData, provider: e.target.value })
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
										required
									>
										<option value="">Select provider</option>
										{MOBILE_MONEY_PROVIDERS.map((provider) => (
											<option key={provider} value={provider}>
												{provider}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Phone Number <span className="text-red-500">*</span>
									</label>
									<Input
										type="tel"
										value={formData.fullPhone}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, "").slice(0, 10);
											setFormData({ 
												...formData, 
												fullPhone: value,
												last4: value.slice(-4) // Auto-populate last4 for display
											});
										}}
										placeholder="0241234567"
										maxLength={10}
										required
									/>
									<p className="text-xs text-gray-500 mt-1">
										Enter your full mobile money number (10 digits)
									</p>
								</div>
							</>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium mb-1">
										Card Network <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										value={formData.provider}
										onChange={(e) =>
											setFormData({ ...formData, provider: e.target.value })
										}
										placeholder="e.g., Visa, Mastercard"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Last 4 digits of card <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										value={formData.last4}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, "").slice(0, 4);
											setFormData({ ...formData, last4: value });
										}}
										placeholder="1234"
										maxLength={4}
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Cardholder Name
									</label>
									<Input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="Name on card"
									/>
								</div>
							</>
						)}

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="isDefaultPayment"
								checked={formData.isDefault}
								onChange={(e) =>
									setFormData({ ...formData, isDefault: e.target.checked })
								}
								className="w-4 h-4"
							/>
							<label htmlFor="isDefaultPayment" className="text-sm font-medium">
								Set as default payment method
							</label>
						</div>

						<div className="flex gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={loading}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading} className="flex-1">
								{loading
									? "Saving..."
									: paymentMethod
										? "Update"
										: "Add Payment Method"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
