"use client";

import { useState, useCallback } from "react";
import { testimonials } from "@/lib/data";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
    <section
      id="testimonials"
      className="bg-linear-to-b from-white to-(--gradient-cream) py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brown-dark">
            What our customers are saying
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="rounded-2xl bg-white p-8 sm:p-12 shadow-lg">
            {/* Quote Icon */}
            <div className="mb-6 flex justify-center">
              <FormatQuoteIcon
                sx={{ fontSize: 48, color: "var(--primary-beige)" }}
                aria-hidden="true"
              />
            </div>

            {/* Quote */}
            <blockquote className="text-center">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
              <footer>
                <cite className="not-italic font-medium text-brown-dark">
                  {testimonials[currentIndex].author}
                </cite>
              </footer>
            </blockquote>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon
              sx={{ fontSize: 24, color: "var(--brown-dark)" }}
            />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon
              sx={{ fontSize: 24, color: "var(--brown-dark)" }}
            />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="mt-8 flex justify-center gap-2" role="tablist">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-brown-dark w-8"
                  : "bg-gray-300 hover:bg-gray-400 w-2"
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
