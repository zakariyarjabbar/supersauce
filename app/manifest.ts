import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | Super Sauce`,
    short_name: site.name,
    description: site.description,
    lang: "ar-IQ",
    dir: "rtl",
    start_url: "/",
    display: "browser",
    background_color: "#faf7ef",
    theme_color: "#ce1725",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
