import { Pizza } from "@/types";

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "All Seasoned Pizza",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 60,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: [
      "Onions",
      "Chicken",
      "Sausage",
      "Pepperoni",
      "Mushrooms",
      "Extra Cheese",
      "Black Olive"
    ],
    featured: true
  },
  {
    id: "2",
    name: "Chicken Pepperoni",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 65,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Hot"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Chicken", "Sweet Corn", "Green Pepper", "Cheese"]
  },
  {
    id: "3",
    name: "Sausage",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 60,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Sausage", "Cheese", "Pepperoni"]
  },
  {
    id: "4",
    name: "Cheese",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 60,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Cheese", "Extra Cheese"]
  },
  {
    id: "5",
    name: "Supreme",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 80,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Pepperoni", "Sausage", "Mushrooms", "Onions", "Green Pepper"]
  },
  {
    id: "6",
    name: "Pepperoni",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 60,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Hot"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Pepperoni", "Cheese"]
  },
  {
    id: "7",
    name: "Magarita",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 65,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Tomato", "Cheese", "Basil"]
  },
  {
    id: "8",
    name: "Seafood",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 90,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Hot"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Shrimp", "Tuna", "Calamari", "Cheese"]
  },
  {
    id: "9",
    name: "Tuna Special",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 85,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Tuna", "Onions", "Cheese"]
  },
  {
    id: "10",
    name: "Vegi Lovers",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 60,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New", "Vegan"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Mushrooms", "Onions", "Green Pepper", "Tomato", "Olives"]
  },
  {
    id: "11",
    name: "Hawaiian",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maecenas dictumst ac nullam sollicitudin suspendisse.",
    price: 80,
    image: "/assets/pizza-placeholder.jpg",
    category: ["New"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Ham", "Pineapple", "Cheese"]
  }
];

export const testimonials = [
  {
    id: "1",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ab dolor alias explicabo similique molestiae ultrices proin bibendum varius eleifend integer lorem.",
    author: "John Doe"
  },
  {
    id: "2",
    quote:
      "Amazing pizza! The quality and taste are exceptional. Fast delivery and great customer service. Highly recommended!",
    author: "Jane Smith"
  },
  {
    id: "3",
    quote:
      "Best pizza in town! Fresh ingredients, perfect crust, and the toppings are always generous. Will order again!",
    author: "Mike Johnson"
  }
];

export const features = [
  {
    id: "1",
    icon: "/assets/badge.svg",
    title: "Quality food",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  },
  {
    id: "2",
    icon: "/assets/handshake.svg",
    title: "Customer Service",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  },
  {
    id: "3",
    icon: "/assets/bike.svg",
    title: "Fast Delivery",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  }
];
