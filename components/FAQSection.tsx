import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui";
import { ArrowForward } from "@mui/icons-material";

const faqs = [
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
    id: "6",
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Typical delivery time is 30-45 minutes depending on your location and current order volume. You'll receive an estimated delivery time when you place your order."
  },
  {
    id: "11",
    category: "menu",
    question: "Do you offer vegan or vegetarian options?",
    answer:
      "Yes! We have several vegetarian pizzas, and we can customize any pizza to be vegetarian. Look for items marked with the 'Vegan' tag in our menu."
  },
  {
    id: "13",
    category: "menu",
    question: "Are your ingredients fresh?",
    answer:
      "We pride ourselves on using only fresh, high-quality ingredients. Our dough is made fresh daily, and we source our produce and meats from trusted local suppliers."
  }
];

export default function FAQSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-brown-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-brown-medium max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Browse our most common
            questions below.
          </p>
        </div>

        <FAQAccordion faqs={faqs} showCategories={false} />

        <div className="text-center mt-8">
          <Button
            href="/faqs"
            variant="ghost"
            color="brown"
            className="border-none"
            icon={<ArrowForward fontSize="small" />}
          >
            View All FAQs
          </Button>
        </div>
      </div>
    </section>
  );
}
