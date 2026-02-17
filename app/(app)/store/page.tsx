import { Metadata } from "next";
import { pizzas } from "@/lib/data";
import { FEATURED_CONFIG } from "@/lib/constants";
import { PizzaCard, Button } from "@/components/ui";
import { FeaturedPizzaCard } from "@/components/FeaturedPizzaCard";
import { SearchFilter } from "@/components/SearchFilter";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Menu - Moshzion Pizza",
  description:
    "Browse our delicious selection of handcrafted pizzas. Order online for delivery or pickup in Accra, Ghana."
};

interface StorePageProps {
  searchParams: Promise<{
    q?: string;
    filter?: string;
  }>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  const selectedFilters = params.filter?.split(",").filter(Boolean) || [];

  const filteredPizzas = pizzas.filter(pizza => {
    const matchesSearch = pizza.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedFilters.length === 0 ||
      selectedFilters.some(filter => pizza.category.includes(filter));

    return matchesSearch && matchesCategory;
  });

  const featuredPizza = filteredPizzas.find(
    p => p.id === FEATURED_CONFIG.pizzaId
  );
  const regularPizzas = filteredPizzas.filter(
    p => p.id !== FEATURED_CONFIG.pizzaId
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-dvh">
      <SearchFilter
        initialQuery={searchQuery}
        initialFilters={selectedFilters}
      />

      <p className="mb-6 text-sm text-gray-600">
        Showing {filteredPizzas.length}{" "}
        {pluralize(filteredPizzas.length, "pizza", "pizzas")}
      </p>

      {filteredPizzas.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPizza && (
            <>
              <div className="sm:hidden">
                <PizzaCard pizza={featuredPizza} />
              </div>
              <div className="hidden sm:block sm:col-span-2">
                <FeaturedPizzaCard pizza={featuredPizza} variant="compact" />
              </div>
            </>
          )}

          {regularPizzas.map(pizza => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">
            No pizzas found matching your criteria.
          </p>
          <Button href="/store" variant="ghost" color="brown" className="mt-4">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
