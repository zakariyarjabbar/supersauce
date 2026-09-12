import type { MenuItem } from "./menu";

export type OrderSelection = {
  item?: MenuItem;
  branchName?: string;
};

export type OrderOptions = { sizeIndex?: number; meal?: boolean; cheese?: boolean };

export function getOrderDetails(item: MenuItem, options: OrderOptions = {}) {
  const size = item.sizes?.[options.sizeIndex ?? 0] ?? item.sizes?.[0];
  const meal = !!(options.meal && item.mealUpgrade);
  const cheese = !!(options.cheese && item.cheeseExtra);
  return {
    price:
      (size?.price ?? item.price) +
      (meal ? item.mealUpgrade! : 0) +
      (cheese ? item.cheeseExtra! : 0),
    label: [
      size?.label,
      item.mealUpgrade ? (meal ? "وجبة" : "ساندويش") : "",
      cheese ? "إضافة جبن" : "",
    ]
      .filter(Boolean)
      .join("، "),
  };
}

function contactNumber(value: string) {
  const number = value
    .trim()
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/[\s()-]/g, "")
    .replace(/^00/, "+")
    .replace(/^07(\d{9})$/, "+9647$1")
    .replace(/^964(7\d{9})$/, "+964$1");
  return /^\+[1-9]\d{6,14}$/.test(number) ? number : "";
}

export function getOrderContactLinks({
  phone,
  whatsapp,
  item,
  branchName,
  options,
}: OrderSelection & { phone: string; whatsapp: string; options?: OrderOptions }) {
  const phoneNumber = contactNumber(phone);
  const whatsappNumber = contactNumber(whatsapp);
  const message = [
    item ? `مرحباً سوبر صوص، أريد أطلب ${item.name}.` : "مرحباً سوبر صوص، أريد أطلب من المنيو.",
    item && options ? getOrderDetails(item, options).label : "",
    branchName ? `بخصوص فرع ${branchName}.` : "",
    "ممكن تأكيد السعر والتوفر وطريقة الاستلام أو التوصيل؟",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    phone: phoneNumber ? `tel:${phoneNumber}` : null,
    whatsapp: whatsappNumber
      ? `https://wa.me/${whatsappNumber.slice(1)}?text=${encodeURIComponent(message)}`
      : null,
  };
}
