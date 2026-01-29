import Image from "next/image";

const features = [
  {
    icon: "/assets/badge.svg",
    title: "Quality food",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  },
  {
    icon: "/assets/handshake.svg",
    title: "Customer Service",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  },
  {
    icon: "/assets/bike.svg",
    title: "Fast Delivery",
    description:
      "Lorem ipsum dolor sit amet, consectur adipiscing elit. Sed maecenas vitae in phasellus. Vivamus phareta tempus et verus at ornse."
  }
];

export default function WhyBuyFromUs() {
  return (
    <section id="why-us" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#5D3A1A]">
            Why buy from Us
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
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

              {/* Title */}
              <h3 className="font-display text-3xl sm:text-4xl text-[#5D3A1A] mb-4">
                {feature.title}
              </h3>

              {/* Description */}
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
