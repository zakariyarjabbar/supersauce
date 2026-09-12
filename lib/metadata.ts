import type { Metadata } from "next";
import { site } from "./site";

export const homeTitle = "سوبر صوص | مو بس برغر، هذا سوبر";
export const shareImage = {
  url: "/social/super-sauce-v1.jpg",
  width: 1200,
  height: 630,
  alt: "شعار سوبر صوص وبرغر على خلفية حمراء، مع عبارة مو بس برغر، هذا سوبر",
};

export function photoShareImage(photo: string, alt: string) {
  return {
    url: `/social/${photo.startsWith("/images/menu/") ? "menu-" : ""}${photo
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, "")}-${photo.startsWith("/images/menu/") ? "v2" : "v1"}.jpg`,
    width: 1200,
    height: 630,
    alt,
  };
}

export function pageMetadata({
  title,
  description = site.description,
  path,
  image = shareImage,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: typeof shareImage;
}): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : homeTitle;
  const url = new URL(path, site.origin).href;
  const imageUrl = new URL(image.url, site.origin).href;
  const twitterImage = new URL(
    image.url === shareImage.url ? "/social/super-sauce-x-v1.jpg" : image.url,
    site.origin,
  ).href;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ar_IQ",
      siteName: site.name,
      title: fullTitle,
      description,
      url,
      images: [
        {
          ...image,
          url: imageUrl,
          ...(imageUrl.startsWith("https://") ? { secureUrl: imageUrl } : {}),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: twitterImage, alt: image.alt }],
    },
  };
}
