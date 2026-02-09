import { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQs | Moshzion - Frequently Asked Questions",
  description:
    "Find answers to common questions about ordering, delivery, payments, menu items, and more at Moshzion Pizza Restaurant."
};

const faqs = [
  // Ordering & Payment
  {
    id: "1",
    category: "ordering",
    question: "How do I place an order?",
    answer:
      "You can place an order directly through our website by browsing our menu, selecting your desired pizzas, customizing toppings and sizes, and proceeding to checkout. It's quick, easy, and secure."
  },
  {
    id: "2",
    category: "ordering",
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards (Visa, Mastercard, American Express), mobile money payments, and cash on delivery. All online payments are processed securely."
  },
  {
    id: "3",
    category: "ordering",
    question: "Can I modify my order after placing it?",
    answer:
      "If you need to modify your order, please contact us immediately at (023) 456 7890. We'll do our best to accommodate changes if your order hasn't been prepared yet."
  },
  {
    id: "4",
    category: "ordering",
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes! We regularly run special promotions and discounts. Sign up for our newsletter or follow us on social media to stay updated on our latest deals and offers."
  },
  {
    id: "5",
    category: "ordering",
    question: "Is there a minimum order amount?",
    answer:
      "There's no minimum order amount for pickup. For delivery orders, a small minimum may apply depending on your location. This will be displayed during checkout."
  },

  // Delivery & Pickup
  {
    id: "6",
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Typical delivery time is 30-45 minutes depending on your location and current order volume. You'll receive an estimated delivery time when you place your order."
  },
  {
    id: "7",
    category: "delivery",
    question: "Do you deliver to my area?",
    answer:
      "We deliver to most areas within a 5-mile radius of our location. Enter your address during checkout to confirm delivery availability."
  },
  {
    id: "8",
    category: "delivery",
    question: "Is there a delivery fee?",
    answer:
      "Delivery fees vary based on distance and current demand. The exact fee will be displayed clearly during checkout before you confirm your order."
  },
  {
    id: "9",
    category: "delivery",
    question: "Can I pick up my order instead?",
    answer:
      "Absolutely! You can choose pickup during checkout. We'll notify you when your order is ready, typically within 15-20 minutes."
  },
  {
    id: "10",
    category: "delivery",
    question: "How do I track my delivery?",
    answer:
      "Once your order is out for delivery, you'll receive updates via SMS or email. For real-time tracking, contact our support team with your order number."
  },

  // Menu & Ingredients
  {
    id: "11",
    category: "menu",
    question: "Do you offer vegan or vegetarian options?",
    answer:
      "Yes! We have several vegetarian pizzas, and we can customize any pizza to be vegetarian. Look for items marked with the 'Vegan' tag in our menu."
  },
  {
    id: "12",
    category: "menu",
    question: "Can I customize my pizza?",
    answer:
      "Definitely! You can add or remove toppings, choose your preferred size, and make special requests. Just use the customization options on each product page."
  },
  {
    id: "13",
    category: "menu",
    question: "Are your ingredients fresh?",
    answer:
      "We pride ourselves on using only fresh, high-quality ingredients. Our dough is made fresh daily, and we source our produce and meats from trusted local suppliers."
  },
  {
    id: "14",
    category: "menu",
    question: "Do you have allergen information?",
    answer:
      "Yes. Our pizzas may contain common allergens like wheat, dairy, and various toppings. If you have specific allergies, please call us at (023) 456 7890 before ordering so we can guide you safely."
  },
  {
    id: "15",
    category: "menu",
    question: "What sizes do your pizzas come in?",
    answer:
      "We offer four sizes: Small (10 inches), Medium (12 inches), Large (14 inches), and Mega (16 inches). Perfect for any appetite or group size!"
  },

  // Other
  {
    id: "16",
    category: "other",
    question: "Do you cater for events?",
    answer:
      "Yes, we offer catering services for parties, corporate events, and special occasions. Contact us at least 48 hours in advance to discuss your needs and get a custom quote."
  },
  {
    id: "17",
    category: "other",
    question: "What are your business hours?",
    answer:
      "We're open Monday through Saturday, 8 AM to 6 PM. We're closed on Sundays to give our team a well-deserved rest!"
  },
  {
    id: "18",
    category: "other",
    question: "Do you have gift cards?",
    answer:
      "Gift cards are coming soon! In the meantime, you can always treat someone to a pizza by placing an order for delivery to their address."
  },
  {
    id: "19",
    category: "other",
    question: "What's your refund policy?",
    answer:
      "If you're not satisfied with your order, please contact us immediately. We'll work to make it right, whether that's a replacement, refund, or credit for your next order."
  },
  {
    id: "20",
    category: "other",
    question: "Are you hiring?",
    answer:
      "We're always looking for passionate team members! Check out our Jobs page or send your resume to contact@email.com with 'Hiring Inquiry' in the subject line."
  }
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-primary">
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-brown-dark mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-brown-medium max-w-3xl mx-auto leading-relaxed">
            Got questions? We&apos;ve got answers. Browse our most common
            questions below or reach out if you need more help.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </main>
  );
}
