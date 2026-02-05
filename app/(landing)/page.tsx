import Hero from "@/components/Hero";
import FeaturedPizzas from "@/components/FeaturedPizzas";
import DeliveryService from "@/components/DeliveryService";
import WhyBuyFromUs from "@/components/WhyBuyFromUs";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedPizzas />
      <DeliveryService />
      <WhyBuyFromUs />
      <Testimonials />
      <FAQSection />
      <Newsletter />
    </>
  );
}
