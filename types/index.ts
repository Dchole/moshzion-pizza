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
