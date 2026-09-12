import catalog from "@/content/menu-catalog.json";

export const categories = [
  { id: "all", label: "كل المنيو" },
  { id: "krisket", label: "كرسكت" },
  { id: "burgers", label: "البرجر" },
  { id: "sandwiches", label: "الساندويشات" },
  { id: "chicken", label: "وجبات الدجاج" },
  { id: "fries", label: "الفرايز" },
  { id: "sides", label: "الأطباق الجانبية" },
  { id: "rezo", label: "الريزو" },
  { id: "sauces", label: "الصوصات" },
  { id: "drinks", label: "المشروبات" },
] as const;

export type Category = (typeof categories)[number]["id"];
export type MenuItem = {
  slug: string;
  name: string;
  englishName: string;
  category: Exclude<Category, "all">;
  price: number;
  description: string;
  image: string;
  imageAlt: string;
  ingredients: string[];
  mealUpgrade?: number;
  cheeseExtra?: number;
  sizes?: { label: string; price: number }[];
  tag?: string;
  spicy?: boolean;
  featured?: boolean;
};

// Source pages and the two confirmed price conflicts: content/menu-source.json.
export const menuItems: MenuItem[] = catalog.map((item) => ({
  ...item,
  category: item.category as MenuItem["category"],
  image: `/images/menu/${item.slug}.webp`,
  imageAlt: `${item.name} بتقديم سوبر صوص — صورة توضيحية محسّنة`,
}));

export const getMenuItem = (slug: string) => menuItems.find((item) => item.slug === slug);
