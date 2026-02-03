// Contact Information
export const CONTACT_INFO = {
  phone: "(023) 456 7890",
  email: "contact@email.com",
  address: "Fire Cabin, Mint st. 15"
} as const;

// Business Hours
export const BUSINESS_HOURS = {
  days: "Monday - Saturday",
  hours: "8 AM - 6 PM"
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  whatsapp: "https://whatsapp.com",
  instagram: "https://instagram.com"
} as const;

// Featured Section Config
export const FEATURED_CONFIG = {
  /** Number of pizzas to show in the grid (excluding the main featured) */
  gridCount: 3,
  /** Starting index for grid pizzas (skip the main featured pizza) */
  gridStartIndex: 1,
  /** Maximum number of toppings to display on featured pizza */
  maxToppingsDisplay: 7,
  /** Original price for featured pizza (for strikethrough) */
  originalPrice: 80
} as const;

// Navigation Links (Header)
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contacts", href: "/contacts" },
  { label: "FAQs", href: "/faqs" }
] as const;

// Mobile Menu Links (organized by section)
export const MOBILE_MENU_SECTIONS = {
  user: [
    { label: "Account", href: "/account", icon: "Person" },
    { label: "Orders", href: "/orders", icon: "ReceiptLong" },
    { label: "Store", href: "/store", icon: "ShoppingCart" }
  ],
  navigation: [
    { label: "About Us", href: "/about", icon: "Info" },
    { label: "Contact Us", href: "/contacts", icon: "Phone" },
    { label: "FAQs", href: "/faqs", icon: "QuestionAnswer" }
  ],
  other: [{ label: "Jobs", href: "/jobs", icon: "Work" }]
} as const;

// Footer Links
export const FOOTER_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" }
] as const;
