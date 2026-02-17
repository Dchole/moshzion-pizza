import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Credits - Moshzion Pizza",
  description: "Image and resource credits for the Moshzion Pizza website."
};

export default function CreditsPage() {
  const imageCredits = [
    {
      name: "Cheese Pizza",
      photographer: "Artem Mihailov",
      photographerUrl: "https://unsplash.com/@mihailovart_pht",
      photoUrl:
        "https://unsplash.com/photos/a-pizza-sitting-on-top-of-a-wooden-cutting-board-7wM-Ad3p56E"
    },
    {
      name: "Chicken Pizza",
      photographer: "Sharan Pagadala",
      photographerUrl: "https://unsplash.com/@shaarannnnn",
      photoUrl:
        "https://unsplash.com/photos/a-person-cutting-a-pizza-V8F8qYxkb_0"
    },
    {
      name: "Hawaiian Pizza",
      photographer: "Alimentos Fotogénicos",
      photographerUrl: "https://unsplash.com/@alimentosfotogenicos",
      photoUrl:
        "https://unsplash.com/photos/a-pizza-sitting-on-top-of-a-wooden-table-hAbJR3yIdls"
    },
    {
      name: "Meat Lovers Pizza",
      photographer: "Warda Naeem",
      photographerUrl: "https://unsplash.com/@mixmosaic1",
      photoUrl:
        "https://unsplash.com/photos/a-large-pizza-sitting-on-top-of-a-table-Wy0pcsXRimI"
    },
    {
      name: "Mushroom Pizza",
      photographer: "David Foodphototasty",
      photographerUrl: "https://unsplash.com/@phototastyfood",
      photoUrl:
        "https://unsplash.com/photos/a-pizza-with-mushrooms-and-ham-on-a-wooden-board-Ew_9G3UfsA0"
    },
    {
      name: "Pepperoni Pizza",
      photographer: "Oscar Ramirez",
      photographerUrl: "https://unsplash.com/@oscareduardohru",
      photoUrl:
        "https://unsplash.com/photos/a-pepperoni-pizza-sitting-on-top-of-a-pan-3d9kKCf4ypk"
    },
    {
      name: "Sausage Pizza",
      photographer: "Shourav Sheikh",
      photographerUrl: "https://unsplash.com/@shouravsheikh",
      photoUrl:
        "https://unsplash.com/photos/pizza-with-cheese-and-green-leaf-a66sGfOnnqQ"
    },
    {
      name: "Seafood Pizza",
      photographer: "Ryan Concepcion",
      photographerUrl: "https://unsplash.com/@bite_size01",
      photoUrl:
        "https://unsplash.com/photos/a-pizza-sitting-on-top-of-a-wooden-cutting-board-I3_z3BZODfo"
    },
    {
      name: "Supreme Pizza",
      photographer: "Pranjall Kumar",
      photographerUrl: "https://unsplash.com/@pranjallk1995",
      photoUrl:
        "https://unsplash.com/photos/pizza-with-cheese-and-tomatoes-on-brown-wooden-round-plate-sejqj6Eaqe8"
    },
    {
      name: "Vegetarian Pizza",
      photographer: "Razieh Bakhtoma",
      photographerUrl: "https://unsplash.com/@raziii1375",
      photoUrl:
        "https://unsplash.com/photos/a-pizza-with-mushrooms-peas-corn-and-peas-on-it-QyyN-XKiGeM"
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-brown-medium hover:text-brown-dark transition-colors font-open-sans"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-brown-dark mb-4">
          Image Credits
        </h1>
        <p className="text-lg text-gray-700 mb-12 font-open-sans">
          We&apos;re grateful to these talented photographers on{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brown-medium hover:text-brown-dark underline"
          >
            Unsplash
          </a>{" "}
          for their beautiful food photography that brings our menu to life.
        </p>

        <div className="bg-white rounded-lg p-6 sm:p-8">
          <h2 className="font-display text-2xl text-brown-dark mb-6">
            Pizza Images
          </h2>
          <div className="space-y-4">
            {imageCredits.map(credit => (
              <div
                key={credit.name}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <h3 className="font-semibold text-brown-dark mb-1 font-open-sans">
                  {credit.name}
                </h3>
                <p className="text-sm text-gray-600 font-open-sans">
                  Photo by{" "}
                  <a
                    href={`${credit.photographerUrl}?utm_source=moshzion&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brown-medium hover:text-brown-dark underline"
                  >
                    {credit.photographer}
                  </a>{" "}
                  on{" "}
                  <a
                    href={`${credit.photoUrl}?utm_source=moshzion&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brown-medium hover:text-brown-dark underline"
                  >
                    Unsplash
                  </a>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-open-sans">
              All images are used under the{" "}
              <a
                href="https://unsplash.com/license"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brown-medium hover:text-brown-dark underline"
              >
                Unsplash License
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
