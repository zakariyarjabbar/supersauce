export type Branch = {
  slug: string;
  name: string;
  city: string;
  area: string;
  address: string;
  hours: string;
  services: string[];
};
// Illustrative branch directory for the approved mock website. Replace before launch.
export const branches: Branch[] = [
  {
    slug: "al-jamia",
    name: "حي الجامعة",
    city: "بغداد",
    area: "الكرخ",
    address: "حي الجامعة، شارع الحمداني",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-ameriya",
    name: "العامرية",
    city: "بغداد",
    area: "الكرخ",
    address: "العامرية، شارع جامع الإخوة الصالحين",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-saydia",
    name: "السيدية",
    city: "بغداد",
    area: "الكرخ",
    address: "السيدية، شارع العلوة",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["سفري", "توصيل"],
  },
  {
    slug: "zayouna",
    name: "زيونة",
    city: "بغداد",
    area: "الرصافة",
    address: "زيونة، الشارع التجاري",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-kadhimiya",
    name: "الكاظمية",
    city: "بغداد",
    area: "الكرخ",
    address: "الكاظمية، الشارع الرئيسي",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري"],
  },
  {
    slug: "al-mahawil",
    name: "المحاويل",
    city: "بابل",
    area: "المحاويل",
    address: "المحاويل، مركز المدينة",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "karbala",
    name: "كربلاء",
    city: "كربلاء",
    area: "مركز المدينة",
    address: "كربلاء، الشارع التجاري",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "najaf",
    name: "النجف",
    city: "النجف",
    area: "مركز المدينة",
    address: "النجف، الشارع الرئيسي",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
];
export const cities = [...new Set(branches.map((b) => b.city))];
export const getBranch = (slug: string) => branches.find((b) => b.slug === slug);
export const branchMapsUrl = (branch: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`سوبر صوص ${branch.name} ${branch.city} العراق`)}`;
