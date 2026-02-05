import { Metadata } from "next";
import Image from "next/image";
import TimelineSection from "@/components/TimelineSection";

export const metadata: Metadata = {
  title: "About Us | Moshzion - Authentic Pizza Restaurant",
  description:
    "Learn about Moshzion's story, our commitment to quality ingredients, and our passion for crafting the perfect pizza experience for our community."
};

const values = [
  {
    id: "1",
    icon: "/assets/badge.svg",
    title: "Quality First",
    description:
      "We never compromise on ingredients. Every pizza is made with the finest, freshest components we can source."
  },
  {
    id: "2",
    icon: "/assets/handshake.svg",
    title: "Community Focused",
    description:
      "We're more than a restaurant - we're your neighbors. Supporting local and bringing people together is what we do."
  },
  {
    id: "3",
    icon: "/assets/bike.svg",
    title: "Passion Driven",
    description:
      "Pizza isn't just food to us, it's an art form. We pour our hearts into every pie we create."
  }
];

const journey = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Started in a small kitchen with a dream and a family recipe passed down through generations."
  },
  {
    year: "2021",
    title: "Growing Together",
    description:
      "Opened our first location and quickly became a neighborhood favorite. The community's support was incredible."
  },
  {
    year: "2023",
    title: "Going Digital",
    description:
      "Launched online ordering to serve you better. Same great pizza, now delivered right to your door."
  },
  {
    year: "2026",
    title: "Today",
    description:
      "Serving thousands of satisfied customers while staying true to our roots - quality, community, and passion."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image - Blurred with color blend */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/chef-kitchen.jpg"
            alt=""
            fill
            className="object-cover blur-3xl scale-110 opacity-60"
            quality={40}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-primary mix-blend-darken z-[1]" />

        {/* Content Grid */}
        <div className="relative z-10 h-full grid lg:grid-cols-2">
          {/* Left Side - Text Content */}
          <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 py-24">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-[#5D3A1A] mb-6">
                Our Story
              </h1>
              <p className="text-lg md:text-xl text-[#8B5A2B] leading-relaxed">
                At Moshzion, we believe pizza is more than just food - it's an
                experience. Every slice tells a story of tradition, quality, and
                the love we put into our craft.
              </p>
            </div>
          </div>

          {/* Right Side - Full Image (No Card) */}
          <div className="relative min-h-[600px] lg:min-h-screen">
            <Image
              src="/assets/chef-kitchen.jpg"
              alt="Our talented chef preparing fresh pizza in the kitchen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="mx-auto max-w-384">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-[#5D3A1A] mb-6">
                What Drives Us
              </h2>
              <p className="text-[#8B5A2B] mb-4 leading-relaxed">
                We started Moshzion with a simple mission: bring authentic,
                delicious pizza to our community using recipes perfected over
                generations. No shortcuts, no compromises.
              </p>
              <p className="text-[#8B5A2B] mb-4 leading-relaxed">
                Every morning, we prepare fresh dough using traditional methods.
                Our tomatoes are hand-selected, our cheese comes from trusted
                local suppliers, and our toppings are sourced with care.
              </p>
              <p className="text-[#8B5A2B] leading-relaxed">
                When you order from Moshzion, you're not just getting a meal -
                you're getting a piece of our heritage, served with pride.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[#8B5A2B]/20 flex items-center justify-center">
                <span className="text-6xl">🍕</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-[#5D3A1A] mb-4">
              Our Values
            </h2>
            <p className="text-[#8B5A2B] max-w-2xl mx-auto">
              These principles guide everything we do, from selecting
              ingredients to serving our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map(value => (
              <div
                key={value.id}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <Image
                    src={value.icon}
                    alt={value.title}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#5D3A1A] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#8B5A2B] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="mx-auto max-w-384">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-[#5D3A1A] mb-4">
              Our Journey
            </h2>
            <p className="text-[#8B5A2B] max-w-2xl mx-auto">
              From a small kitchen to your favorite pizza spot - here's how we
              got here.
            </p>
          </div>

          <TimelineSection journey={journey} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-384">
          <div className="bg-gradient-to-r from-[#5D3A1A] to-[#8B5A2B] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display mb-6">
              Taste the Difference
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Experience the passion, quality, and tradition that goes into
              every Moshzion pizza. Order now and become part of our story.
            </p>
            <a
              href="/store"
              className="inline-block bg-white text-[#5D3A1A] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Order Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
