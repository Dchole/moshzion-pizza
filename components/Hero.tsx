import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PhoneIcon from "@mui/icons-material/Phone";
import { Button } from "@/components/ui";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative bg-linear-to-br from-gray-800 to-gray-900 text-white overflow-hidden min-h-[85vh] flex items-start"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-cover.png"
          alt="Delicious pizza with fresh toppings"
          fill
          className="object-cover opacity-70 hidden md:block"
          priority
          sizes="100vw"
        />
        <Image
          src="/assets/hero-cover-mobile.png"
          alt="Delicious pizza with fresh toppings"
          fill
          className="object-cover opacity-70 md:hidden"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-384 w-full px-4 pt-24 sm:px-6 sm:py-32 lg:px-8 lg:py-48">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl lg:text-8xl mb-8">
            Brighten your day with a delicious pizza
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-(--hero-accent) mb-10 max-w-lg">
            Make an order now and have it delivered at our doorstep
          </p>

          <div className="flex flex-row flex-wrap gap-4">
            <Button
              href="/store"
              variant="primary"
              color="white"
              icon={
                <ShoppingCartIcon sx={{ fontSize: 20 }} aria-hidden="true" />
              }
              className="flex-1 sm:flex-initial"
            >
              Go to our store
            </Button>

            <Button
              href="tel:0233456789"
              variant="outline"
              color="white"
              icon={<PhoneIcon sx={{ fontSize: 20 }} aria-hidden="true" />}
              className="flex-1 sm:flex-initial"
            >
              Call Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
