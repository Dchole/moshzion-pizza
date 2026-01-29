"use client";

import { useState } from "react";

const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque ab dolor alias explicabo similique molestiae ultrices proin bibendum varius eleifend integer lorem.",
    author: "john Doe"
  },
  {
    quote:
      "Amazing pizza! The quality and taste are exceptional. Fast delivery and great customer service. Highly recommended!",
    author: "Jane Smith"
  },
  {
    quote:
      "Best pizza in town! Fresh ingredients, perfect crust, and the toppings are always generous. Will order again!",
    author: "Mike Johnson"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="bg-linear-to-b from-white to-[#FFF5E6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#5D3A1A]">
            What our customers are saying
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div className="rounded-2xl bg-white p-8 sm:p-12 shadow-lg">
            {/* Quote Icon */}
            <div className="mb-6 flex justify-center">
              <svg
                className="h-12 w-12 text-[#E5D4C1]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Quote */}
            <blockquote className="text-center">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
              <footer>
                <cite className="not-italic font-medium text-[#5D3A1A]">
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
            <svg
              className="h-6 w-6 text-[#5D3A1A]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <svg
              className="h-6 w-6 text-[#5D3A1A]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#5D3A1A] w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
