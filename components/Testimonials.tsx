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
    <section id="testimonials" className="bg-brown-dark py-16 sm:py-24">
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
                sx={{ fontSize: 48, color: "var(--beige-light)", opacity: 0.8 }}
                aria-hidden="true"
              />
            </div>

            <blockquote className="text-center">
              <p className="text-lg sm:text-xl text-beige-light leading-relaxed mb-8 max-w-2xl mx-auto">
                {testimonials[currentIndex].quote}
              </p>
              <footer>
                <cite className="not-italic font-medium text-beige-light">
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
                  ? "bg-beige-light w-8"
                  : "bg-beige-light/40 hover:bg-beige-light/60 w-2"
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
