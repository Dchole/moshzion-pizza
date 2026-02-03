"use client";

import { useState, useMemo, useCallback } from "react";
import { pizzas } from "@/lib/data";
import type { Pizza } from "@/types";
import { PizzaCard } from "@/components/ui";
import { FeaturedPizzaCard } from "@/components/FeaturedPizzaCard";
import { SearchFilter } from "@/components/SearchFilter";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearchChange = useCallback((query: string, filters: string[]) => {
    setSearchQuery(query);
    setSelectedFilters(filters);
  }, []);

  const filteredPizzas = useMemo(() => {
    return pizzas.filter(pizza => {
      const matchesSearch = pizza.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedFilters.length === 0 ||
        selectedFilters.some(filter => pizza.category.includes(filter));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedFilters]);

  const featuredPizza = filteredPizzas.find(p => p.id === "1");
  const regularPizzas = filteredPizzas.filter(p => p.id !== "1");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-dvh">
      <SearchFilter onSearchChange={handleSearchChange} />

      <p className="mb-6 text-sm text-gray-600">
        Showing {filteredPizzas.length}{" "}
        {filteredPizzas.length === 1 ? "pizza" : "pizzas"}
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
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilters([]);
            }}
            className="mt-4 text-[#8B5A2B] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
