import { resolveSiteOrigin } from "./site-origin";

export const site = {
  name: "سوبر صوص",
  latinName: "Super Sauce",
  description:
    "مو بس برغر، هذا سوبر. اكتشف البرغر، الدجاج المقرمش، الصوصات وبوكسات اللمة من سوبر صوص في العراق.",
  origin: resolveSiteOrigin({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    deploymentUrl: process.env.VERCEL_URL,
  }),
  instagram: "https://www.instagram.com/supersauce.iq/",
  orderPhone: process.env.NEXT_PUBLIC_ORDER_PHONE || "",
  orderWhatsapp: process.env.NEXT_PUBLIC_ORDER_WHATSAPP || "",
};

export const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "المنيو" },
  { href: "/branches", label: "فروعنا" },
  { href: "/about", label: "حكاية السوبر" },
  { href: "/contact", label: "نسمعك" },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function normalizeArabic(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F\u0670]/g, "");
}
