"use client";

import { useState, useCallback } from "react";
import { testimonials } from "@/lib/data";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SectionHeader, IconButton } from "@/components/ui";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section id="testimonials" className="bg-[#5D3A1A] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What our customers are saying"
          color="white"
          className="mb-12"
        />

        <div className="relative px-16 sm:px-20">
          <div className="py-8 sm:py-12">
            <div className="mb-6 flex justify-center">
              <FormatQuoteIcon
                sx={{ fontSize: 48, color: "#E5D4C1", opacity: 0.8 }}
                aria-hidden="true"
              />
            </div>

            <blockquote className="text-center">
              <p className="text-lg sm:text-xl text-[#E5D4C1] leading-relaxed mb-8 max-w-2xl mx-auto">
                {testimonials[currentIndex].quote}
              </p>
              <footer>
                <cite className="not-italic font-medium text-[#E5D4C1]">
                  {testimonials[currentIndex].author}
                </cite>
              </footer>
            </blockquote>
          </div>

          <IconButton
            variant="filled"
            color="white"
            size="lg"
            icon={<ChevronLeftIcon sx={{ fontSize: 24 }} />}
            aria-label="Previous testimonial"
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-lg shadow-none hover:bg-gray-100"
          />

          <IconButton
            variant="filled"
            color="white"
            size="lg"
            icon={<ChevronRightIcon sx={{ fontSize: 24 }} />}
            aria-label="Next testimonial"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg shadow-none hover:bg-gray-100"
          />
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#E5D4C1] w-8"
                  : "bg-[#E5D4C1]/40 hover:bg-[#E5D4C1]/60 w-2"
              }`}
              role="tab"
              aria-label={`Go to testimonial ${index + 1}`}
              aria-selected={index === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
