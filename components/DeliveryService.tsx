import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, SectionHeader } from "@/components/ui";

export default function DeliveryService() {
  return (
    <section id="delivery" className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our delivery service"
          subtitle={[
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis neque fusce fermentum scelerisque amet pulvinar.",
            "Aenean vulputate mi molestie egestas quisque enim etiam vitae. Tempor orci,"
          ]}
          className="mb-8"
        />

        {/* CTA Button */}
        <div className="text-center">
          <Button
            href="/about"
            variant="ghost"
            color="brown"
            size="sm"
            icon={
              <OpenInNewIcon
                sx={{ fontSize: 16, color: "var(--brown-medium)" }}
              />
            }
          >
            Read more about us
          </Button>
        </div>
      </div>
    </section>
  );
}
