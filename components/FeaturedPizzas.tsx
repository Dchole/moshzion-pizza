import { pizzas } from "@/lib/data";
import { FEATURED_CONFIG } from "@/lib/constants";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Button, PizzaCard } from "@/components/ui";
import { FeaturedPizzaCard } from "@/components/FeaturedPizzaCard";

export default function FeaturedPizzas() {
  const featuredPizza = pizzas[0];
  const gridPizzas = pizzas.slice(
    FEATURED_CONFIG.gridStartIndex,
    FEATURED_CONFIG.gridStartIndex + FEATURED_CONFIG.gridCount
  );

  return (
    <section
      id="featured"
      className="bg-linear-to-b from-(--gradient-cream) to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brown-dark mb-4">
            Our Customers&apos; favourites
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-2 leading-tight text-left sm:text-center">
            These are most loved choices by our lovely customers.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto text-left sm:text-center">
            Make a delicious choice and never regret it.
          </p>
          <p className="text-lg sm:text-xl text-gray-600 mt-6 max-w-lg mx-auto text-left sm:text-center">
            Get the best pizza in town right at your doorstep with just a few
            clicks.
          </p>
        </div>

        <FeaturedPizzaCard pizza={featuredPizza} variant="hero" />

        <div className="mt-16 -mx-4 px-4 pt-4 flex gap-6 overflow-x-auto pb-4 sm:mx-0 sm:px-0 sm:pt-0 sm:grid sm:grid-cols-2 sm:gap-12 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {gridPizzas.map(pizza => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              className="min-w-70 sm:min-w-0"
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            href="/store"
            variant="outline"
            color="brown"
            icon={
              <StorefrontIcon
                sx={{ fontSize: 20, color: "var(--brown-dark)" }}
                className="group-hover:text-white"
              />
            }
            className="group"
          >
            Go to our store
          </Button>
        </div>
      </div>
    </section>
  );
}
