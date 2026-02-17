import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://moshzion.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/contacts",
    "/faqs",
    "/credits",
    "/store",
    "/cart",
    "/checkout",
    "/account",
    "/orders"
  ];

  return routes.map(route => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
