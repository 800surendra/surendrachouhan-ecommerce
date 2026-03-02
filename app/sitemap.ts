import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://surendrachouhan-ecommerce-xeb9.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://surendrachouhan-ecommerce-xeb9.vercel.app/books",
      lastModified: new Date(),
    },
    {
      url: "https://surendrachouhan-ecommerce-xeb9.vercel.app/cart",
      lastModified: new Date(),
    },
  ];
}