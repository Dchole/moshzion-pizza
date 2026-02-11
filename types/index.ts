export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  sizes: PizzaSize[];
  toppings: string[];
  featured?: boolean;
}

export interface PizzaSize {
  name: "Small" | "Medium" | "Large" | "Mega";
  size: string;
  priceMultiplier: number;
}

export interface CartItem {
  id: string;
  pizzaId: string;
  name: string;
  price: number;
  size: PizzaSize["name"];
  toppings: string[];
  quantity: number;
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  pizzaId: string;
  name: string;
  price: number;
  size: string;
  toppings: string[];
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string | null;
  addressId: string | null;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  guestName: string | null;
  guestPhone: string | null;
  guestAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    firstName: string | null;
    lastName: string | null;
    phone: string;
  } | null;
  address?: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string | null;
    zipCode: string | null;
    country: string;
  } | null;
}

// Hubtel Payment Types
export interface HubtelReceiveMoneyRequest {
  customerName: string;
  customerMobileNumber: string;
  customerEmail?: string;
  amount: number;
  primaryCallbackUrl: string;
  description: string;
  clientReference: string;
}

export interface HubtelPaymentResponse {
  status: string;
  message: string;
  data?: {
    transactionId: string;
    clientReference: string;
    amount: number;
    charges: number;
    amountAfterCharges: number;
    amountCharged: number;
    description: string;
    externalTransactionId: string | null;
    hubtelTransactionId: string | null;
    paymentStatus: string;
  };
}

export interface HubtelPaymentStatusResponse {
  status: string;
  message: string;
  data?: {
    transactionId: string;
    transactionStatus: string;
    amount: number;
    charges: number;
    customerName: string;
    customerMobileNumber: string;
  };
}
