export const site = {
  name: "سوبر صوص",
  latinName: "Super Sauce",
  description:
    "مو بس برغر، هذا سوبر. اكتشف البرغر، الدجاج المقرمش، الصوصات وبوكسات اللمة من سوبر صوص في العراق.",
  origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  demo: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  instagram: "https://www.instagram.com/supersauce.iq/",
  delivery: "https://www.talabat.com/ar/iraq/super-sauce",
  baly: "https://food.baly.iq/vendors/super-sauce/",
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
