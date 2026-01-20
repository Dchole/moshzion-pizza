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

export interface Topping {
  id: string;
  name: string;
  price?: number;
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

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
}
