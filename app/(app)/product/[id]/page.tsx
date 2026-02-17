import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { pizzas } from "@/lib/data";
import { FEATURED_CONFIG } from "@/lib/constants";
import { ProductDetails } from "@/components/ProductDetails";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return pizzas.map(pizza => ({
    id: pizza.id
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pizza = pizzas.find(p => p.id === id);

  if (!pizza) {
    return {
      title: "Pizza Not Found - Moshzion"
    };
  }

  return {
    title: `${pizza.name} - Moshzion`,
    description: pizza.description,
    openGraph: {
      title: `${pizza.name} - Moshzion`,
      description: pizza.description,
      images: [pizza.image]
    }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pizza = pizzas.find(p => p.id === id);

  if (!pizza) {
    notFound();
  }

  const hasDiscount = pizza.id === FEATURED_CONFIG.pizzaId;
  const originalPrice = hasDiscount ? FEATURED_CONFIG.originalPrice : null;
  const siteUrl = process.env.NEXTAUTH_URL || "https://moshzion.vercel.app";

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pizza.name,
    description: pizza.description,
    image: [`${siteUrl}${pizza.image}`],
    brand: {
      "@type": "Brand",
      name: "Moshzion Pizza"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: pizza.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/product/${pizza.id}`
    }
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
        }}
      />
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:py-8">
          <div className="relative aspect-square overflow-hidden bg-gray-200 lg:rounded-lg">
            {pizza.image ? (
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                Pizza Image
              </div>
            )}
          </div>

          <div className="px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
            <ProductDetails
              pizza={pizza}
              hasDiscount={hasDiscount}
              originalPrice={originalPrice}
            />

            <div className="mt-8 hidden md:block">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 text-brown-medium hover:text-brown-dark transition-colors font-open-sans"
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
                Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
