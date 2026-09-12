"use client";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { normalizeArabic } from "@/lib/site";

export const faqs = [
  {
    q: "شلون أطلب من سوبر صوص؟",
    a: "تصفح المنيو واضغط «اطلب» على الوجبة. تفتح نافذة فيها وسائل التواصل: اتصال هاتفي، واتساب أو إنستغرام، حسب المتاح. اختار وسيلتك وأكمل تفاصيل الطلب مباشرة مع المطعم.",
    category: "الطلبات",
  },
  {
    q: "شلون أحدد الكمية أو أطلب تعديل على الوجبة؟",
    a: "حدد الكمية والإضافات والملاحظات خلال الاتصال أو المحادثة مع المطعم. تأكد من تفاصيل طلبك والسعر النهائي قبل التأكيد.",
    category: "الطلبات",
  },
  {
    q: "شنو طرق الدفع المتوفرة؟",
    a: "اسأل المطعم عن طرق الدفع المتاحة عند التواصل لتأكيد طلبك. الموقع ما يستقبل مدفوعات أو بيانات بطاقات.",
    category: "الطلبات",
  },
  {
    q: "شلون أعرف أقرب فرع؟",
    a: "استخدم خريطة الفروع بالصفحة الرئيسية واضغط «استخدم موقعي»، أو ابحث باسم المنطقة واختار المحافظة. اضغط على الفرع حتى تشوف تفاصيله وتفتح الطريق على خرائط Google.",
    category: "الفروع",
  },
  {
    q: "شنو أوقات عمل الفروع؟",
    a: "تلقى وقت العمل ضمن بطاقة كل فرع. ممكن تختلف الأوقات بين الفروع وبالعطل، فتواصل مع الفرع إذا تخطط لزيارة بوقت متأخر.",
    category: "الفروع",
  },
  {
    q: "التوصيل متوفر لكل المناطق؟",
    a: "نطاق التوصيل يعتمد على الفرع وموقعك. أرسل منطقتك للمطعم خلال المحادثة أو اذكرها بالاتصال حتى تتأكد من التغطية والأجرة ووقت التوصيل.",
    category: "الفروع",
  },
  {
    q: "عندي حساسية غذائية، شنو أسوي؟",
    a: "راجع المكونات بصفحة الوجبة، وتواصل مباشرة مع الفرع قبل الطلب للتأكد من مسببات الحساسية واحتمال التلامس بين المكونات.",
    category: "المنيو",
  },
  {
    q: "الأسعار تشمل الوجبة؟",
    a: "بقسم البرغر والسندويشات، السعر الأساسي للسندويش وتكدر تخليه وجبة بإضافة 2,000 دينار. الخيارات والأسعار تبين بصفحة الصنف وعند الضغط على «اطلب». وجبات الدجاج تتضمن الإضافات المذكورة بوصفها.",
    category: "المنيو",
  },
  {
    q: "أحب أنضم للفريق، وين أقدّم؟",
    a: "افتح صفحة «انضم للفريق» وتواصل ويانا بالطريقة المتاحة. عرّفنا بنفسك وخبرتك ومحافظتك والمجال اللي تحب تشتغل بيه، واسأل عن الفرص المناسبة إلك.",
    category: "عن الموقع",
  },
];
export function FaqList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const visible = faqs.filter(
    (f) =>
      (category === "الكل" || f.category === category) &&
      normalizeArabic(`${f.q} ${f.a}`).includes(normalizeArabic(query)),
  );
  return (
    <>
      <div className="search-field">
        <Search size={20} />
        <label htmlFor="faq-search" className="sr-only">
          ابحث عن سؤال
        </label>
        <input
          id="faq-search"
          type="search"
          placeholder="شنو سؤالك؟"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="category-tabs faq-tabs" aria-label="مواضيع الأسئلة">
        {["الكل", "الطلبات", "الفروع", "المنيو", "عن الموقع"].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} أسئلة
      </p>
      <div className="faq-list">
        {visible.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <Plus size={22} aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <h2>سؤالك ما موجود هنا؟</h2>
          <p>جرّب كلمة ثانية، أو اكتب لنا من صفحة نسمعك.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setCategory("الكل");
              setQuery("");
            }}
          >
            عرض كل الأسئلة
          </button>
        </div>
      )}
    </>
  );
}
