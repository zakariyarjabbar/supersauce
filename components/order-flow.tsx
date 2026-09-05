"use client";
import { useState, useRef, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bike,
  Store,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Check,
  Printer,
  Banknote,
  Info,
} from "lucide-react";
import { useCart } from "./cart-provider";
import { BrandStar } from "./brand";
import { menuItems } from "@/lib/menu";
import { branches } from "@/lib/branches";
import { site, formatPrice } from "@/lib/site";
import { orderSchema, fieldErrors } from "@/lib/validation";

type Receipt = {
  id: string;
  name: string;
  branch: string;
  fulfillment: string;
  subtotal: number;
  delivery: number;
  items: { name: string; price: number; quantity: number }[];
};
export function OrderFlow() {
  const { cart, count, total, update, clear, ready } = useCart();
  const params = useSearchParams();
  const initialBranch = branches.find((b) => b.slug === params.get("branch"));
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">(
    initialBranch && !initialBranch.services.includes("توصيل") ? "pickup" : "delivery",
  );
  const [branch, setBranch] = useState(initialBranch?.slug || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const delivery = fulfillment === "delivery" ? 2000 : 0;
  const available = branches.filter(
    (b) => fulfillment === "pickup" || b.services.includes("توصيل"),
  );
  const inputProps = (name: string) => ({
    id: `order-${name}`,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `order-${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`order-${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  const chooseFulfillment = (value: "delivery" | "pickup") => {
    setFulfillment(value);
    if (
      value === "delivery" &&
      !branches.find((b) => b.slug === branch)?.services.includes("توصيل")
    )
      setBranch("");
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!site.demo || !cart.length) return;
    const data = new FormData(event.currentTarget);
    const result = orderSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      fulfillment,
      branch,
      address: data.get("address") || "",
      notes: data.get("notes") || "",
    });
    const selected = available.find((b) => b.slug === branch);
    if (!result.success || !selected) {
      const nextErrors = !result.success
        ? fieldErrors(result.error)
        : { branch: "اختار فرعاً متاحاً لطريقة الاستلام" };
      setErrors(nextErrors);
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
          ?.focus(),
      );
      return;
    }
    setErrors({});
    setReceipt({
      id: `DEMO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      name: result.data.name,
      branch: selected.name,
      fulfillment,
      subtotal: total,
      delivery,
      items: cart.flatMap((line) => {
        const item = menuItems.find((i) => i.slug === line.slug);
        return item ? [{ name: item.name, price: item.price, quantity: line.quantity }] : [];
      }),
    });
    clear();
    requestAnimationFrame(() => {
      successRef.current?.focus();
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (!ready)
    return (
      <div className="container loading-content" role="status">
        نحضّر طلبك...
      </div>
    );
  if (receipt)
    return (
      <div className="container receipt-container">
        <div className="receipt" ref={successRef} tabIndex={-1}>
          <span className="success-icon">
            <Check size={36} />
          </span>
          <h2>طلبك التجريبي جاهز!</h2>
          <p>عاشت إيدك، {receipt.name}. هكذا تبدو نهاية تجربة الطلب.</p>
          <div className="demo-callout">
            <Info size={19} />
            <span>لم يُرسل هذا الطلب إلى المطعم، ولم يُخصم أي مبلغ. هذه نسخة عرض فقط.</span>
          </div>
          <div className="receipt-meta">
            <span>
              رقم التجربة <b dir="ltr">{receipt.id}</b>
            </span>
            <span>
              {receipt.fulfillment === "delivery" ? "توصيل" : "استلام من الفرع"} · {receipt.branch}
            </span>
          </div>
          <div className="receipt-items">
            {receipt.items.map((item) => (
              <div key={item.name}>
                <span>
                  {item.quantity} × {item.name}
                </span>
                <b dir="ltr">
                  {formatPrice(item.price * item.quantity)} <small>د.ع</small>
                </b>
              </div>
            ))}
          </div>
          <div className="receipt-delivery">
            <span>التوصيل</span>
            <span>
              {receipt.delivery ? `${formatPrice(receipt.delivery)} د.ع` : "استلام بدون رسوم"}
            </span>
          </div>
          <div className="receipt-total">
            <span>المجموع التجريبي</span>
            <b>
              {formatPrice(receipt.subtotal + receipt.delivery)} <small>د.ع</small>
            </b>
          </div>
          <div className="receipt-actions">
            <Link href="/menu" className="button button-red">
              نرجع للمنيو <ArrowLeft size={18} />
            </Link>
            <button className="button button-outline" onClick={() => window.print()}>
              <Printer size={19} />
              اطبع الملخص
            </button>
          </div>
        </div>
        <BrandStar className="receipt-star" />
      </div>
    );
  if (!cart.length)
    return (
      <section className="container order-empty">
        <ShoppingBag size={62} strokeWidth={1.3} />
        <h2>طلبك ينتظر أول لقمة.</h2>
        <p>بعدك ما أضفت وجبتك. شوف المنيو واختار اللي يضبط مزاجك.</p>
        <Link href="/menu" className="button button-red">
          يلا نختار <ArrowLeft size={19} />
        </Link>
        <div className="empty-suggestions">
          {menuItems
            .filter((item) => item.featured)
            .slice(0, 3)
            .map((item) => (
              <Link href={`/menu/${item.slug}`} key={item.slug}>
                <Image src={item.image} alt={item.name} width={160} height={120} />
                <span>{item.name}</span>
              </Link>
            ))}
        </div>
      </section>
    );
  return (
    <section className="container order-layout">
      <div className="order-main">
        <div className="order-section-heading">
          <h2>
            اختياراتك السوبر <span>({count})</span>
          </h2>
          <button className="subtle-button" onClick={clear}>
            تفريغ الطلب <Trash2 size={15} />
          </button>
        </div>
        <div className="cart-items">
          {cart.map((line) => {
            const item = menuItems.find((p) => p.slug === line.slug)!;
            return (
              <article className="cart-line" key={line.slug}>
                <Link
                  href={`/menu/${line.slug}`}
                  className="cart-image"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image src={item.image} alt={item.imageAlt} width={140} height={120} />
                </Link>
                <div className="cart-line-info">
                  <h3>
                    <Link href={`/menu/${line.slug}`}>{item.name}</Link>
                  </h3>
                  <span>{formatPrice(item.price)} د.ع للحبة</span>
                  <div className="quantity-control">
                    <button
                      aria-label={`زيادة ${item.name}`}
                      disabled={line.quantity >= 20}
                      onClick={() => update(line.slug, line.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                    <output aria-label={`كمية ${item.name}`}>{line.quantity}</output>
                    <button
                      aria-label={`تقليل ${item.name}`}
                      disabled={line.quantity <= 1}
                      onClick={() => update(line.slug, line.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
                <div className="cart-line-end">
                  <b dir="ltr">
                    {formatPrice(item.price * line.quantity)} <small>د.ع</small>
                  </b>
                  <button
                    className="icon-button"
                    onClick={() => update(line.slug, 0)}
                    aria-label={`إزالة ${item.name} من الطلب`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <Link href="/menu" className="text-link">
          نضيف شي ثاني؟ <Plus size={18} />
        </Link>
        {site.demo ? (
          <form
            ref={formRef}
            id="checkout-form"
            onSubmit={submit}
            noValidate
            className="checkout-form"
          >
            <h2>شلون تحب تستلم؟</h2>
            <div className="fulfillment-options" role="group" aria-label="طريقة الاستلام">
              <button
                type="button"
                aria-pressed={fulfillment === "delivery"}
                className={fulfillment === "delivery" ? "selected" : ""}
                onClick={() => chooseFulfillment("delivery")}
              >
                <Bike size={26} />
                <span>
                  <b>توصيل لبيتك</b>
                  <small>الطعم يوصلك لبابك</small>
                </span>
                {fulfillment === "delivery" && <Check size={18} />}
              </button>
              <button
                type="button"
                aria-pressed={fulfillment === "pickup"}
                className={fulfillment === "pickup" ? "selected" : ""}
                onClick={() => chooseFulfillment("pickup")}
              >
                <Store size={26} />
                <span>
                  <b>استلام من الفرع</b>
                  <small>مرّ وخذ وجبتك</small>
                </span>
                {fulfillment === "pickup" && <Check size={18} />}
              </button>
            </div>
            <div className="field">
              <label htmlFor="order-branch">
                اختار الفرع <span>*</span>
              </label>
              <select
                {...inputProps("branch")}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="" disabled>
                  اختار فرعك من القائمة
                </option>
                {available.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.city} — {b.name}
                  </option>
                ))}
              </select>
              {error("branch")}
            </div>
            <h2>تفاصيلك</h2>
            <p className="form-demo-note checkout-demo">
              جرّب ببيانات وهمية؛ هذا الطلب ما يوصل للمطعم.
            </p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="order-name">
                  الاسم <span>*</span>
                </label>
                <input
                  {...inputProps("name")}
                  required
                  autoComplete="name"
                  maxLength={80}
                  placeholder="اسمك الكريم"
                />
                {error("name")}
              </div>
              <div className="field">
                <label htmlFor="order-phone">
                  رقم الموبايل <span>*</span>
                </label>
                <input
                  {...inputProps("phone")}
                  required
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder="07XXXXXXXXX"
                />
                {error("phone")}
              </div>
              {fulfillment === "delivery" && (
                <div className="field full-field">
                  <label htmlFor="order-address">
                    عنوان التوصيل <span>*</span>
                  </label>
                  <textarea
                    {...inputProps("address")}
                    required
                    rows={3}
                    autoComplete="street-address"
                    maxLength={300}
                    placeholder="المنطقة، الشارع، وأقرب نقطة دالة"
                  />
                  {error("address")}
                </div>
              )}
              <div className="field full-field">
                <label htmlFor="order-notes">
                  ملاحظات على الطلب <small>(اختياري)</small>
                </label>
                <textarea
                  {...inputProps("notes")}
                  rows={2}
                  maxLength={500}
                  placeholder="بدون مخلل؟ صوص على جنب؟ احچيلنا..."
                />
                {error("notes")}
              </div>
            </div>
            <h2>طريقة الدفع</h2>
            <div className="cash-method">
              <Banknote size={27} />
              <span>
                <b>نقداً عند الاستلام</b>
                <small>خيار توضيحي، ماكو دفع حقيقي في نسخة العرض</small>
              </span>
              <Check size={19} />
            </div>
          </form>
        ) : (
          <div className="live-order-panel">
            <h2>كمّل طلبك عبر تطبيق التوصيل.</h2>
            <p>قائمتك هنا للاختيار. شوف التوفر والسعر النهائي وأعد اختيار وجبتك داخل التطبيق.</p>
            <a
              href={site.delivery}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-red"
            >
              افتح طلبات <ArrowUpLeft size={19} />
            </a>
            <a
              href={site.baly}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-outline"
            >
              افتح بَلي <ArrowUpLeft size={19} />
            </a>
          </div>
        )}
      </div>
      <aside className="order-summary">
        <h2>ملخّص الطعم.</h2>
        <div className="summary-line">
          <span>الوجبات ({count})</span>
          <b>
            {formatPrice(total)} <small>د.ع</small>
          </b>
        </div>
        {site.demo && (
          <div className="summary-line">
            <span>{fulfillment === "delivery" ? "توصيل تجريبي" : "استلام من الفرع"}</span>
            <b>{delivery ? `${formatPrice(delivery)} د.ع` : "بدون رسوم"}</b>
          </div>
        )}
        <div className="summary-total">
          <span>المجموع{site.demo ? " التجريبي" : " التقريبي"}</span>
          <b dir="ltr">
            {formatPrice(total + (site.demo ? delivery : 0))} <small>د.ع</small>
          </b>
        </div>
        {site.demo && (
          <>
            <p className="summary-note">الأسعار ورسوم التوصيل توضيحية. لا يوجد حجز أو دفع فعلي.</p>
            <button type="submit" form="checkout-form" className="button button-red button-wide">
              أكمل الطلب التجريبي <ArrowLeft size={19} />
            </button>
            <p className="summary-terms">
              بالمتابعة، أنت مطّلع على <Link href="/terms">شروط الاستخدام</Link> و
              <Link href="/privacy">الخصوصية</Link>.
            </p>
          </>
        )}
        <div className="summary-brand">
          <BrandStar />
          <span>
            كل لقمة تستاهل
            <br />
            <b>تكون سوبر.</b>
          </span>
          <BrandStar />
        </div>
      </aside>
    </section>
  );
}
