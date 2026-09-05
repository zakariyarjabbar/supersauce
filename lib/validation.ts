import { z } from "zod";

export function normalizePhone(value: string) {
  return value
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776))
    .replace(/[\s()-]/g, "");
}
export const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine(
    (value) => /^(?:07\d{9}|(?:\+?964|00964)7\d{9})$/.test(value),
    "اكتب رقم موبايل عراقي صحيح، مثل 07XXXXXXXXX",
  );
export const contactSchema = z.object({
  kind: z.enum(["contact", "careers"]),
  name: z.string().trim().min(2, "اكتب اسمك الكامل").max(80, "الاسم طويل، اختصره إلى 80 حرفاً"),
  email: z.email("اكتب بريداً إلكترونياً صحيحاً").max(160),
  phone: z.union([z.literal(""), phoneSchema], {
    error: "اكتب رقم موبايل عراقي صحيح أو اترك الحقل فارغاً",
  }),
  city: z.string().trim().min(1, "اختار محافظتك").max(60),
  topic: z.string().trim().min(1, "اختار موضوع الرسالة").max(80),
  message: z
    .string()
    .trim()
    .min(10, "اكتب تفاصيل أكثر، 10 أحرف على الأقل")
    .max(2000, "الحد الأعلى 2000 حرف"),
  portfolio: z
    .union(
      [
        z.literal(""),
        z
          .url("اكتب رابطاً صحيحاً يبدأ بـ https://")
          .refine((v) => v.startsWith("https://"), "الرابط لازم يبدأ بـ https://"),
      ],
      { error: "اكتب رابطاً صحيحاً يبدأ بـ https:// أو اترك الحقل فارغاً" },
    )
    .optional(),
  consent: z.literal(true, { error: "وافق على سياسة الخصوصية حتى تكمل" }),
  website: z.string().max(200).optional(),
});
export const orderSchema = z
  .object({
    name: z.string().trim().min(2, "اكتب اسمك الكامل").max(80),
    phone: phoneSchema,
    fulfillment: z.enum(["delivery", "pickup"]),
    branch: z.string().min(1, "اختار الفرع أولاً"),
    address: z.string().trim().max(300),
    notes: z.string().trim().max(500),
  })
  .superRefine((value, ctx) => {
    if (value.fulfillment === "delivery" && value.address.length < 10)
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: "اكتب المنطقة والشارع وأقرب نقطة دالة",
      });
  });

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
