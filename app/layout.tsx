import type { Metadata } from "next";
import { Lobster, Open_Sans } from "next/font/google";
import "./globals.css";

const lobster = Lobster({
  weight: "400",
  variable: "--font-lobster",
  subsets: ["latin"],
  display: "swap"
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Moshzion - Brighten your day with a delicious pizza",
  description:
    "Make an order now and have it delivered at our doorstep. Get the best pizza in town right at your doorstep with just a few clicks.",
  keywords: ["pizza", "delivery", "restaurant", "food", "online ordering"],
  openGraph: {
    title: "Moshzion - Delicious Pizza Delivery",
    description: "Make an order now and have it delivered at our doorstep",
    type: "website"
  }
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${lobster.variable} antialiased font-sans`}
      >
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
