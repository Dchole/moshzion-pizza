// Product Types
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

// Cart Types
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

// Testimonial Type
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

// Feature Type (Why Buy From Us)
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}
