"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { pizzas } from "@/lib/data";
import type { Pizza } from "@/types";
import { PizzaCard } from "@/components/ui";
import { FeaturedPizzaCard } from "@/components/FeaturedPizzaCard";

const categories = ["New", "Vegan", "Hot", "Promo"];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-4xl text-[#5D3A1A]">Store</h1>

        <div className="flex flex-1 gap-2 sm:max-w-md">
          <div className="relative flex-1">
            <label htmlFor="search" className="sr-only">
              Search pizzas
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="search"
              placeholder="What pizza are you looking for?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
            aria-expanded={isFilterOpen}
            aria-label="Toggle filters"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`mb-8 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleFilter(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedFilters.includes(category)
                  ? "border-[#5D3A1A] bg-[#5D3A1A] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-[#8B5A2B] hover:bg-gray-50"
              }`}
              aria-pressed={selectedFilters.includes(category)}
            >
              {category}
            </button>
          ))}
          {selectedFilters.length > 0 && (
            <button
              onClick={() => setSelectedFilters([])}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

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
