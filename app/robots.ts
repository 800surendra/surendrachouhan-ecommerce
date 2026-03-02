import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://surendrachouhan-ecommerce-xeb9.vercel.app/sitemap.xml",
  };
}