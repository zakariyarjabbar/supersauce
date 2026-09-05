export type Category = "all" | "burgers" | "chicken" | "sides" | "boxes" | "sauces";
export type MenuItem = {
  slug: string;
  name: string;
  category: Exclude<Category, "all">;
  price: number;
  description: string;
  image: string;
  imageAlt: string;
  ingredients: string[];
  tag?: string;
  spicy?: boolean;
  featured?: boolean;
};

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "كل المنيو" },
  { id: "burgers", label: "البرغر" },
  { id: "chicken", label: "الدجاج" },
  { id: "sides", label: "عالجانب" },
  { id: "boxes", label: "بوكسات اللمة" },
  { id: "sauces", label: "الصوصات" },
];

const burgerImage = "/images/hero-burger.webp";
const chickenImage = "/images/chicken-burger.webp";
const friesImage = "/images/loaded-fries.webp";
const boxImage = "/images/sharing-meal.webp";
const sauceImage = "/images/sauces.webp";

// Presentation data approved by the user. Names draw on public menus; prices,
// descriptions, photographs and availability are illustrative and need approval.
export const menuItems: MenuItem[] = [
  {
    slug: "smoky-burger",
    name: "سموكي برغر",
    category: "burgers",
    price: 6500,
    description: "لحم مشوي، بصل مقرمش وصوص سموكي. نكهة تبقى على بالك.",
    image: burgerImage,
    imageAlt: "برغر لحم بالجبن والصوص داخل خبز بريوش",
    ingredients: ["خبز بريوش", "لحم مشوي", "خس وطماطم", "مخلل", "بصل مقرمش", "صوص سموكي"],
    tag: "اختيار السوبر",
    featured: true,
  },
  {
    slug: "crispy-chicken",
    name: "كريسبي تشيكن",
    category: "chicken",
    price: 6500,
    description: "قرمشة تسمعها من أول لقمة، مع خس طازج وصوصنا الخاص.",
    image: chickenImage,
    imageAlt: "برغر دجاج مقرمش مع الخس والصوص",
    ingredients: ["خبز بريوش", "دجاج مقرمش", "خس", "مخلل", "صوص سوبر"],
    featured: true,
  },
  {
    slug: "crazy-fries",
    name: "كريزي فرايز",
    category: "sides",
    price: 5000,
    description: "فرايز ذهبية، جبن ذايب وصوصات على كيفك. مو مجرد إضافة.",
    image: friesImage,
    imageAlt: "بطاطا مقلية مغطاة بالجبن والصوص",
    ingredients: ["بطاطا", "صوص شيدر", "قطع دجاج", "صوص سوبر", "هالبينو"],
    tag: "للصوص عشّاق",
    featured: true,
  },
  {
    slug: "super-box",
    name: "سوبر لمة بوكس",
    category: "boxes",
    price: 27500,
    description: "برغر، دجاج، فرايز وصوصات. كل اللي تحبه بلمة وحدة.",
    image: boxImage,
    imageAlt: "تشكيلة برغر ودجاج وبطاطا وصوصات للمشاركة",
    ingredients: ["٢ برغر لحم", "١ برغر دجاج", "ستربس", "فرايز", "صوصات", "٢ مشروب"],
    tag: "شارك الطعم",
    featured: true,
  },
  {
    slug: "cheesy-burger",
    name: "تشيزي برغر",
    category: "burgers",
    price: 7000,
    description: "شريحة لحم مع شيدر ذايب وصوص الجبن. لأن الجبن ما ينشبع منه.",
    image: burgerImage,
    imageAlt: "برغر لحم مغطى بجبن شيدر ذائب",
    ingredients: ["خبز بريوش", "لحم مشوي", "شيدر", "خس", "مخلل", "صوص الجبن"],
  },
  {
    slug: "commando-burger",
    name: "كوماندوز برغر",
    category: "burgers",
    price: 9000,
    description: "دبل لحم، دبل مزاج. طبقات مشبعة ونكهة سموكي جريئة.",
    image: burgerImage,
    imageAlt: "برغر دبل لحم مع جبن وخضار",
    ingredients: ["خبز بريوش", "شريحتا لحم", "جبن", "بصل مقرمش", "خضار", "صوص سموكي"],
    tag: "دبل لحم",
  },
  {
    slug: "mushroom-burger",
    name: "مشروم برغر",
    category: "burgers",
    price: 8000,
    description: "لحم مشوي، مشروم وبصل مكرمل. لعشاق النكهة الغنية.",
    image: burgerImage,
    imageAlt: "صورة توضيحية لبرغر لحم",
    ingredients: ["خبز بريوش", "لحم مشوي", "مشروم", "جبن سويسري", "بصل مكرمل"],
  },
  {
    slug: "omg-burger",
    name: "أو إم جي برغر",
    category: "burgers",
    price: 10000,
    description: "دبل لحم وشيدر وصوص أكثر. الاسم يحچي عن نفسه.",
    image: burgerImage,
    imageAlt: "برغر دبل مع طبقات من الجبن والصوص",
    ingredients: ["خبز بريوش", "شريحتا لحم", "شيدر", "صوص جبن", "مخلل", "صوص سوبر"],
  },
  {
    slug: "nashville-chicken",
    name: "ناشفل تشيكن",
    category: "chicken",
    price: 7500,
    description: "دجاج كريسبي بلمسة حارة، مخلل وصوص يوازن اللقمة.",
    image: chickenImage,
    imageAlt: "ساندويش دجاج مقرمش",
    ingredients: ["خبز بريوش", "دجاج مقرمش", "بهارات حارة", "مخلل", "صوص سوبر"],
    spicy: true,
    tag: "مزاج حار",
  },
  {
    slug: "chicken-bucket",
    name: "باكيت الكرسبي",
    category: "chicken",
    price: 14500,
    description: "قطع دجاج مقرمشة ويا فرايز وصوص. وجبة ما تحتاج تفكير.",
    image: "/images/fried-chicken.webp",
    imageAlt: "باكيت أحمر مليء بقطع الدجاج المقلي",
    ingredients: ["٤ قطع دجاج", "فرايز", "صوص سوبر", "صوص ثوم"],
  },
  {
    slug: "crispy-strips",
    name: "ستربس سوبر",
    category: "chicken",
    price: 7500,
    description: "ستربس دجاج ذهبية، قرمشة خفيفة وصوص للتغميس.",
    image: "/images/fried-chicken.webp",
    imageAlt: "صورة توضيحية لوجبة الدجاج المقرمش",
    ingredients: ["ستربس دجاج", "فرايز", "صوص سوبر"],
  },
  {
    slug: "cheese-fries",
    name: "تشيزي فرايز",
    category: "sides",
    price: 4000,
    description: "فرايز ساخنة يغطيها صوص شيدر. البساطة بطعم سوبر.",
    image: friesImage,
    imageAlt: "بطاطا مع صوص الجبن",
    ingredients: ["بطاطا", "صوص شيدر", "بهارات"],
  },
  {
    slug: "family-box",
    name: "بوكس العائلة",
    category: "boxes",
    price: 42000,
    description: "خلي اللمة علينا. تشكيلة أكبر حتى كل واحد يلكه اللي يحبه.",
    image: boxImage,
    imageAlt: "وجبة عائلية من البرغر والدجاج والصوصات",
    ingredients: ["٤ برغر متنوع", "دجاج مقرمش", "٢ فرايز", "٤ صوصات", "مشروبات"],
    tag: "لمة أكبر",
  },
  {
    slug: "duo-box",
    name: "بوكس الثنائي",
    category: "boxes",
    price: 18000,
    description: "برغرين، فرايز وصوصين. خطّة جاهزة إلك ولصاحبك.",
    image: boxImage,
    imageAlt: "تشكيلة وجبة برغر للمشاركة",
    ingredients: ["٢ برغر", "فرايز", "٢ صوص", "٢ مشروب"],
  },
  {
    slug: "super-sauce",
    name: "صوص السوبر",
    category: "sauces",
    price: 1000,
    description: "اللمسة اللي تجمع اللقمة. كريمي وبنكهة ترجع إلها.",
    image: sauceImage,
    imageAlt: "مجموعة صوصات للتغميس",
    ingredients: ["صوص السوبر الكريمي"],
  },
  {
    slug: "cheddar-sauce",
    name: "صوص الشيدر",
    category: "sauces",
    price: 1500,
    description: "جبن، وبعد جبن. رفيق الفرايز والبرغر المفضل.",
    image: sauceImage,
    imageAlt: "صوص جبن شيدر أصفر",
    ingredients: ["صوص جبن الشيدر"],
  },
  {
    slug: "smoky-sauce",
    name: "صوص السموكي",
    category: "sauces",
    price: 1000,
    description: "نكهة مدخنة تعطي كل لقمة شخصيتها.",
    image: sauceImage,
    imageAlt: "صوصات كريمية ومدخنة",
    ingredients: ["صوص بنكهة مدخنة"],
  },
  {
    slug: "spicy-sauce",
    name: "الصوص الحار",
    category: "sauces",
    price: 1000,
    description: "للّي يحب اللقمة إلها حرارة. زوّد الحماس على ذوقك.",
    image: sauceImage,
    imageAlt: "صوص حار أحمر للتغميس",
    ingredients: ["صوص فلفل حار"],
    spicy: true,
  },
];

export const getMenuItem = (slug: string) => menuItems.find((item) => item.slug === slug);
