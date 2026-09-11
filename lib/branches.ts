export type Branch = {
  slug: string;
  name: string;
  city: string;
  area: string;
  address: string;
  hours: string;
  services: string[];
  coordinates: { lat: number; lng: number };
  phone?: string;
  whatsapp?: string;
  image?: string;
};
// Illustrative branch directory for the approved mock website. Replace before launch.
// Map pins are intentionally sample locations, approved by the user for this demo.
// Replace coordinates with each branch's latitude/longitude; add approved phone and
// WhatsApp numbers (including +964). Empty numbers display a non-callable placeholder.
export const branches: Branch[] = [
  {
    slug: "al-jamia",
    coordinates: { lat: 33.3371, lng: 44.2927 },
    phone: "",
    whatsapp: "",
    name: "حي الجامعة",
    city: "بغداد",
    area: "الكرخ",
    address: "حي الجامعة، شارع الحمداني",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-ameriya",
    coordinates: { lat: 33.3021, lng: 44.2675 },
    phone: "",
    whatsapp: "",
    name: "العامرية",
    city: "بغداد",
    area: "الكرخ",
    address: "العامرية، شارع جامع الإخوة الصالحين",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-saydia",
    coordinates: { lat: 33.2587, lng: 44.3406 },
    phone: "",
    whatsapp: "",
    name: "السيدية",
    city: "بغداد",
    area: "الكرخ",
    address: "السيدية، شارع العلوة",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["سفري", "توصيل"],
  },
  {
    slug: "zayouna",
    coordinates: { lat: 33.3297, lng: 44.4631 },
    phone: "",
    whatsapp: "",
    name: "زيونة",
    city: "بغداد",
    area: "الرصافة",
    address: "زيونة، الشارع التجاري",
    hours: "١٢ ظهراً – ٢ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "al-kadhimiya",
    coordinates: { lat: 33.3761, lng: 44.3441 },
    phone: "",
    whatsapp: "",
    name: "الكاظمية",
    city: "بغداد",
    area: "الكرخ",
    address: "الكاظمية، الشارع الرئيسي",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري"],
  },
  {
    slug: "al-mahawil",
    coordinates: { lat: 32.6672, lng: 44.4054 },
    phone: "",
    whatsapp: "",
    name: "المحاويل",
    city: "بابل",
    area: "المحاويل",
    address: "المحاويل، مركز المدينة",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "karbala",
    coordinates: { lat: 32.616, lng: 44.0249 },
    phone: "",
    whatsapp: "",
    name: "كربلاء",
    city: "كربلاء",
    area: "مركز المدينة",
    address: "كربلاء، الشارع التجاري",
    hours: "١٢ ظهراً – ١ بعد منتصف الليل",
    services: ["صالة", "سفري", "توصيل"],
  },
  {
    slug: "najaf",
    coordinates: { lat: 32.0015, lng: 44.3386 },
    phone: "",
    whatsapp: "",
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
export const branchDirectionsUrl = (branch: Branch) =>
  `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;
