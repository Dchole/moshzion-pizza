import Image from "next/image";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Button } from "@/components/ui";

export function EmptyCartState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative h-64 w-full">
            <Image
              src="/assets/Empty Cart.svg"
              alt="Empty Cart"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="font-display text-4xl text-brown-dark mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">Add an item from the store</p>

        <Button
          href="/store"
          variant="primary"
          color="beige"
          icon={<StorefrontIcon sx={{ fontSize: 20 }} />}
          iconPosition="right"
        >
          Go to Store
        </Button>
      </div>
    </div>
  );
}
