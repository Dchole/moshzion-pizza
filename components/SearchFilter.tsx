"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@/components/ui";
import {
  Filter1Outlined,
  Filter2Outlined,
  FilterAltOutlined
} from "@mui/icons-material";

const categories = ["New", "Vegan", "Hot", "Promo"];

interface SearchFilterProps {
  onSearchChange?: (query: string, filters: string[]) => void;
}

export function SearchFilter({ onSearchChange }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    searchParams.get("filter")?.split(",").filter(Boolean) || []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (selectedFilters.length > 0) {
      params.set("filter", selectedFilters.join(","));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    router.replace(newUrl, { scroll: false });

    if (onSearchChange) {
      onSearchChange(searchQuery, selectedFilters);
    }
  }, [searchQuery, selectedFilters, router, onSearchChange]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-4xl text-[#5D3A1A]">Store</h1>

        <div className="flex flex-1 gap-2 sm:max-w-md">
          <div className="relative flex-1">
            <label htmlFor="search" className="sr-only">
              Search pizzas
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
            </div>
            <input
              id="search"
              type="search"
              placeholder="What pizza are you looking for?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm placeholder:text-gray-500 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <IconButton
                  variant="ghost"
                  color="brown"
                  size="sm"
                  icon={<CloseIcon sx={{ fontSize: 18 }} />}
                  aria-label="Clear search"
                  onClick={clearSearch}
                />
              </div>
            )}
          </div>

          <IconButton
            variant="outline"
            size="sm"
            icon={<FilterAltOutlined sx={{ fontSize: 20 }} />}
            aria-label="Toggle filters"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden rounded-md! border! border-gray-300! text-gray-500! hover:bg-gray-100!"
          />
        </div>
      </div>

      <div className={`mb-8 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleFilter(category)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                selectedFilters.includes(category)
                  ? "border-[#5D3A1A] bg-[#5D3A1A] text-white shadow-sm"
                  : "border-gray-300 bg-white text-gray-600 hover:border-[#8B5A2B] hover:bg-gray-50"
              }`}
              aria-pressed={selectedFilters.includes(category)}
            >
              {category}
            </button>
          ))}
          {selectedFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="ml-1 text-xs font-medium text-[#8B5A2B] hover:text-[#5D3A1A] hover:underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
