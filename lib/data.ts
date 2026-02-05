import { Pizza } from "@/types";

export const pizzas: Pizza[] = [
  {
    id: "1",
    name: "Meat Lovers",
    description:
      "A carnivore's dream loaded with pepperoni, Italian sausage, ham, bacon, and ground beef. Perfect for those who can't get enough meat on their pizza.",
    price: 85,
    image: "/assets/product-images/meat-lovers.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: [
      "Pepperoni",
      "Italian Sausage",
      "Ham",
      "Bacon",
      "Ground Beef",
      "Extra Cheese"
    ]
  },
  {
    id: "2",
    name: "Chicken Pizza",
    description:
      "Tender grilled chicken breast with fresh vegetables, topped with our signature sauce. A healthier option that doesn't compromise on flavor.",
    price: 65,
    image: "/assets/product-images/chicken-pizza.jpg",
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
      "Classic Italian sausage pizza with premium pork sausage, herbs, and melted mozzarella. Simple, savory, and absolutely delicious.",
    price: 60,
    image: "/assets/product-images/sausage-pizza.jpg",
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
      "Classic cheese pizza with our homemade tomato sauce and a generous blend of mozzarella. Sometimes simple is best - pure cheesy goodness in every bite.",
    price: 60,
    image: "/assets/product-images/cheese-pizza.jpg",
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
      "The ultimate combination! Loaded with pepperoni, Italian sausage, fresh mushrooms, green peppers, onions, and black olives. Everything you love on one pizza.",
    price: 80,
    image: "/assets/product-images/supreme-pizza.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: [
      "Pepperoni",
      "Sausage",
      "Mushrooms",
      "Onions",
      "Green Pepper",
      "Black Olive",
      "Extra Cheese"
    ]
  },
  {
    id: "6",
    name: "Pepperoni",
    description:
      "America's favorite! Generous portions of spicy pepperoni with melted mozzarella on our signature crust. A timeless classic that never disappoints.",
    price: 60,
    image: "/assets/product-images/pepperoni-pizza.jpg",
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
    name: "Mushroom Pizza",
    description:
      "Fresh mushrooms sautéed to perfection, layered on our signature sauce with garlic and mozzarella. A must-try for mushroom lovers!",
    price: 65,
    image: "/assets/product-images/mushroom-pizza.jpg",
    category: ["New", "Promo"],
    sizes: [
      { name: "Small", size: "18cm", priceMultiplier: 1 },
      { name: "Medium", size: "24cm", priceMultiplier: 1.3 },
      { name: "Large", size: "30cm", priceMultiplier: 1.6 },
      { name: "Mega", size: "36cm", priceMultiplier: 2 }
    ],
    toppings: ["Mushrooms", "Garlic", "Extra Cheese", "White Sauce"]
  },
  {
    id: "8",
    name: "Seafood",
    description:
      "A luxurious seafood medley featuring shrimp, calamari, and tuna with garlic and herbs. Fresh from the ocean to your plate!",
    price: 90,
    image: "/assets/product-images/seafood-pizza.jpg",
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
    id: "10",
    name: "Vegi Pizza",
    description:
      "A colorful garden of fresh vegetables including mushrooms, bell peppers, onions, tomatoes, and black olives. Healthy, delicious, and guilt-free!",
    price: 60,
    image: "/assets/product-images/vegi-pizza.jpg",
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
      "The tropical favorite! Sweet pineapple chunks and savory ham create the perfect sweet and salty combination. Love it or hate it, you have to try it!",
    price: 80,
    image: "/assets/product-images/hawaiian-pizza.jpg",
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
      "Absolutely love this place! The crust is perfectly crispy, and the toppings are always fresh. It's become our family's go-to spot for pizza night.",
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
      "We use only the finest ingredients sourced from trusted suppliers. Every pizza is crafted with care, ensuring you get the authentic taste you deserve."
  },
  {
    id: "2",
    icon: "/assets/handshake.svg",
    title: "Customer Service",
    description:
      "Our friendly team is always ready to help. Whether you have questions about your order or need recommendations, we're here to make your experience great."
  },
  {
    id: "3",
    icon: "/assets/bike.svg",
    title: "Fast Delivery",
    description:
      "Hot pizza at your doorstep in no time. Our efficient delivery team ensures your order arrives fresh and piping hot, just the way you like it."
  }
];
