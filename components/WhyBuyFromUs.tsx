import Image from "next/image";
import { features } from "@/lib/data";

export default function WhyBuyFromUs() {
  return (
    <section id="why-us" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center mb-16 font-display text-5xl sm:text-6xl lg:text-7xl text-brown-dark">
          Why buy from Us
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map(feature => (
            <div key={feature.id} className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative h-20 w-20">
                  <Image
                    src={feature.icon}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl text-brown-dark mb-4">
                {feature.title}
              </h3>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
