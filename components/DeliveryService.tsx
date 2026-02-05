import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, SectionHeader } from "@/components/ui";

export default function DeliveryService() {
  return (
    <section id="delivery" className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our delivery service"
          subtitle={[
            "We bring the taste of authentic pizza right to your door. Every order is carefully prepared and delivered with speed and care.",
            "Whether you're hosting a party or just craving a delicious meal, we've got you covered with reliable service you can count on."
          ]}
          className="mb-8"
        />

        <div className="text-center">
          <Button
            href="/about"
            variant="outline"
            color="brown"
            icon={
              <OpenInNewIcon
                sx={{ fontSize: 18, color: "var(--brown-medium)" }}
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
