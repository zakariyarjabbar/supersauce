import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { menuItems } from "@/lib/menu";
import { branches } from "@/lib/branches";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/menu",
    "/branches",
    "/about",
    "/contact",
    "/careers",
    "/faq",
    "/privacy",
    "/terms",
    ...menuItems.map((i) => `/menu/${i.slug}`),
    ...branches.map((b) => `/branches/${b.slug}`),
  ].map((path) => ({
    url: `${site.origin}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.6,
  }));
}
