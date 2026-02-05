"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type FAQAccordionProps = {
  faqs: FAQ[];
  showCategories?: boolean;
};

export default function FAQAccordion({
  faqs,
  showCategories = true
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "ordering", label: "Ordering & Payment" },
    { id: "delivery", label: "Delivery & Pickup" },
    { id: "menu", label: "Menu & Ingredients" },
    { id: "other", label: "Other" }
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div>
      {/* Category Filter */}
      {showCategories && (
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-[#5D3A1A] text-white shadow-md"
                  : "bg-white text-[#5D3A1A] hover:bg-[#8B5A2B]/10"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-[#8B5A2B]">
            No questions found in this category.
          </div>
        ) : (
          filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-[#8B5A2B]/20 overflow-hidden transition-all hover:border-[#8B5A2B]/40"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#E5D4C1]/30 transition-colors"
                aria-expanded={openId === faq.id}
              >
                <span className="text-lg font-semibold text-[#5D3A1A] pr-4">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 text-[#8B5A2B] transition-transform duration-300 ${
                    openId === faq.id ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {openId === faq.id ? <RemoveIcon /> : <AddIcon />}
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openId === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-6 pb-4 text-[#8B5A2B] leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
