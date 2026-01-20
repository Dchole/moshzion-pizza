import type { Metadata } from "next";
import { Miniver, Inter } from "next/font/google";
import "./globals.css";

const miniver = Miniver({
  weight: "400",
  variable: "--font-miniver",
  subsets: ["latin"],
  display: "swap"
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Mostrizza - Brighten your day with a delicious pizza",
  description:
    "Make an order now and have it delivered at our doorstep. Get the best pizza in town right at your doorstep with just a few clicks.",
  keywords: ["pizza", "delivery", "restaurant", "food", "online ordering"],
  openGraph: {
    title: "Mostrizza - Delicious Pizza Delivery",
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
        className={`${inter.variable} ${miniver.variable} antialiased font-sans`}
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
