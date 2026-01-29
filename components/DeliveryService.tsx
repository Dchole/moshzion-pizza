import Image from "next/image";
import Link from "next/link";

export default function DeliveryService() {
  return (
    <section id="delivery" className="bg-[#E5D4C1] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#5D3A1A] mb-6">
            Our delivery service
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis mus
            accumsan fermentum scelerisque amet pulvinar.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Aenean vulputate mi molestie egestas qpuique enim nibh vitae. Tempor
            eros.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-16">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#5D3A1A] bg-white px-8 py-3 text-base font-medium text-[#5D3A1A] hover:bg-gray-50 transition-colors"
          >
            Read more about us
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
