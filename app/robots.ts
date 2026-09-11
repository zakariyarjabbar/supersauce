import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  // Sharing clients must be able to fetch the HTML and preview assets.
  // Demo pages retain their noindex/nofollow metadata in the root layout.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/order", "/api/"] },
    ...(site.demo ? {} : { sitemap: `${site.origin}/sitemap.xml` }),
  };
}
