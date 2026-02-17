import Hero from "@/components/Hero";
import FeaturedPizzas from "@/components/FeaturedPizzas";
import DeliveryService from "@/components/DeliveryService";
import WhyBuyFromUs from "@/components/WhyBuyFromUs";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import Newsletter from "@/components/Newsletter";
import { BUSINESS_HOURS, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function Home() {
  const siteUrl = process.env.NEXTAUTH_URL || "https://moshzion.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Moshzion Pizza",
        url: siteUrl,
        logo: `${siteUrl}/assets/logo.svg`,
        sameAs: [
          SOCIAL_LINKS.facebook,
          SOCIAL_LINKS.instagram,
          SOCIAL_LINKS.whatsapp
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: CONTACT_INFO.phone,
          email: CONTACT_INFO.email,
          contactType: "customer service"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}#local-business`,
        name: "Moshzion Pizza",
        url: siteUrl,
        image: `${siteUrl}/assets/hero-cover.png`,
        telephone: CONTACT_INFO.phone,
        email: CONTACT_INFO.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACT_INFO.address
        },
        openingHours: [BUSINESS_HOURS.days],
        servesCuisine: ["Pizza"],
        priceRange: "$$"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
