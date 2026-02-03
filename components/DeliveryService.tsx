import Link from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function DeliveryService() {
  return (
    <section id="delivery" className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-brown-dark mb-6">
            Our delivery service
          </h2>
          <p className="text-lg sm:text-xl text-brown-dark max-w-2xl mx-auto mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis
            neque fusce fermentum scelerisque amet pulvinar.
          </p>
          <p className="text-lg sm:text-xl text-brown-dark max-w-2xl mx-auto">
            Aenean vulputate mi molestie egestas quisque enim etiam vitae.
            Tempor orci,
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-brown-medium bg-transparent px-6 py-2.5 text-sm font-medium text-brown-medium hover:bg-gray-50 transition-colors"
          >
            Read more about us
            <OpenInNewIcon
              sx={{ fontSize: 16, color: "var(--brown-medium)" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
