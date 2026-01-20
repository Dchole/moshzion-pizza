import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-linear-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-cover.png"
          alt=""
          fill
          className="object-cover opacity-70 hidden md:block"
          priority
          sizes="100vw"
        />
        <Image
          src="/assets/hero-cover-mobile.png"
          alt=""
          fill
          className="object-cover opacity-70 md:hidden"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1536px] px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-48">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl lg:text-8xl mb-8">
            Brighten your day with a delicious pizza
          </h1>
          <p className="text-2xl text-[#A9D0DB] mb-10 max-w-lg">
            Make an order now and have it delivered at our doorstep
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-[#5D3A1A] shadow-lg hover:bg-gray-100 transition-colors"
            >
              Go to our store
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            <Link
              href="tel:0233456789"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
            >
              Call Us
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
