"use client";
import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { site } from "@/lib/site";

const provinces = [
  "بغداد",
  "البصرة",
  "نينوى",
  "أربيل",
  "النجف",
  "كربلاء",
  "بابل",
  "كركوك",
  "الأنبار",
  "ديالى",
  "صلاح الدين",
  "واسط",
  "القادسية",
  "المثنى",
  "ذي قار",
  "ميسان",
  "السليمانية",
  "دهوك",
  "حلبجة",
];
export function ContactForm({
  kind = "contact",
  initialTopic = "",
}: {
  kind?: "contact" | "careers";
  initialTopic?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [demoResult, setDemoResult] = useState(site.demo);
  const [messageLength, setMessageLength] = useState(0);
  const careers = kind === "careers";
  const inputProps = (name: string) => ({
    id: `${kind}-${name}`,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${kind}-${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${kind}-${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const result = contactSchema.safeParse({
      kind,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      city: data.get("city"),
      topic: data.get("topic"),
      message: data.get("message"),
      portfolio: data.get("portfolio") || "",
      consent: data.get("consent") === "on",
      website: data.get("website") || "",
    });
    if (!result.success) {
      const nextErrors = fieldErrors(result.error);
      setErrors(nextErrors);
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
          ?.focus(),
      );
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
        signal: AbortSignal.timeout(15000),
      });
      const body = await response.json();
      if (!response.ok) {
        setServerMessage(body.error || "ما اكتمل الإرسال. حاول مرة ثانية.");
        setStatus("error");
      } else {
        setDemoResult(body.demo === true);
        setStatus("success");
      }
    } catch {
      setServerMessage("الاتصال انقطع. معلوماتك باقية هنا، جرّب مرة ثانية.");
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  if (status === "success")
    return (
      <div className="form-success" ref={statusRef} tabIndex={-1} role="status">
        <span className="success-icon">
          <Check size={35} />
        </span>
        <h2>{demoResult ? "اكتملت التجربة!" : "وصلتنا رسالتك."}</h2>
        <p>
          {demoResult
            ? "هذا نموذج تجريبي. ما أرسلنا معلوماتك إلى المطعم وما حفظناها، لكن تقدر تشوف شلون راح تكون التجربة كاملة."
            : "شكراً لوقتك. نراجع رسالتك ونتواصل وياك على البريد اللي كتبته."}
        </p>
        <button
          className="button button-red"
          onClick={() => {
            setStatus("idle");
            setMessageLength(0);
            requestAnimationFrame(() =>
              formRef.current?.querySelector<HTMLInputElement>("input")?.focus(),
            );
          }}
        >
          اكتب رسالة جديدة <ArrowLeft size={18} />
        </button>
      </div>
    );
  return (
    <form ref={formRef} onSubmit={submit} noValidate className="contact-form">
      <div className="form-heading">
        <h2>{careers ? "خلّينا نتعرّف عليك." : "احچيلنا."}</h2>
        <p>
          {careers
            ? "عرّفنا بنفسك وبالمجال اللي تحب تشتغل بيه."
            : "ملاحظة، اقتراح، أو سالفة حلوة. نحب نسمعها."}
        </p>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor={`${kind}-name`}>
            الاسم الكامل <span>*</span>
          </label>
          <input
            {...inputProps("name")}
            autoComplete="name"
            maxLength={80}
            required
            placeholder="اسمك الكريم"
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor={`${kind}-email`}>
            البريد الإلكتروني <span>*</span>
          </label>
          <input
            {...inputProps("email")}
            type="email"
            dir="ltr"
            autoComplete="email"
            maxLength={160}
            required
            placeholder="you@example.com"
          />
          {error("email")}
        </div>
        <div className="field">
          <label htmlFor={`${kind}-phone`}>
            رقم الموبايل <small>(اختياري)</small>
          </label>
          <input
            {...inputProps("phone")}
            type="tel"
            dir="ltr"
            autoComplete="tel"
            maxLength={20}
            placeholder="07XXXXXXXXX"
          />
          {error("phone")}
        </div>
        <div className="field">
          <label htmlFor={`${kind}-city`}>
            المحافظة <span>*</span>
          </label>
          <select {...inputProps("city")} defaultValue="" required>
            <option value="" disabled>
              اختار محافظتك
            </option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {error("city")}
        </div>
        <div className="field full-field">
          <label htmlFor={`${kind}-topic`}>
            {careers ? "المجال اللي يهمك" : "بخصوص شنو؟"} <span>*</span>
          </label>
          <select {...inputProps("topic")} defaultValue={initialTopic} required>
            <option value="" disabled>
              اختار {careers ? "المجال" : "الموضوع"}
            </option>
            {(careers
              ? [
                  "فريق المطبخ",
                  "خدمة الزبائن والكاشير",
                  "إدارة الفروع",
                  "التسويق والإدارة",
                  "مجال آخر",
                ]
              : ["تجربة في أحد الفروع", "اقتراح", "استفسار عن المنيو", "تعاون وشراكات", "موضوع آخر"]
            ).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {error("topic")}
        </div>
        {careers && (
          <div className="field full-field">
            <label htmlFor={`${kind}-portfolio`}>
              رابط السيرة الذاتية <small>(اختياري)</small>
            </label>
            <input
              {...inputProps("portfolio")}
              type="url"
              dir="ltr"
              placeholder="https://..."
              maxLength={1000}
            />
            {error("portfolio")}
          </div>
        )}
        <div className="field full-field">
          <label htmlFor={`${kind}-message`}>
            {careers ? "نبذة عنك وعن خبرتك" : "رسالتك"} <span>*</span>
          </label>
          <textarea
            {...inputProps("message")}
            rows={5}
            required
            maxLength={2000}
            placeholder={
              careers ? "احچيلنا عن خبرتك، مهاراتك، وشغلك المفضل..." : "اكتب اللي ببالك هنا..."
            }
            onChange={(e) => setMessageLength(e.target.value.length)}
          />
          {error("message")}
          <span className="character-count" dir="ltr">
            {messageLength} / 2000
          </span>
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input id={`${kind}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="checkbox-field">
        <input {...inputProps("consent")} type="checkbox" required />
        <span>
          قرأت{" "}
          <Link href="/privacy" target="_blank">
            سياسة الخصوصية
          </Link>{" "}
          وأوافق على استخدام معلوماتي للرد على رسالتي.
        </span>
      </label>
      {error("consent")}
      {status === "error" && (
        <div ref={statusRef} tabIndex={-1} className="form-alert" role="alert">
          {serverMessage}
        </div>
      )}
      <button
        type="submit"
        className="button button-red button-wide"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <LoaderCircle className="spin" size={19} />
            جاري الإرسال...
          </>
        ) : (
          <>
            {site.demo ? "جرّب إرسال الرسالة" : "أرسل الرسالة"}
            <ArrowLeft size={19} />
          </>
        )}
      </button>
      {site.demo && (
        <p className="form-demo-note">
          نسخة عرض: الرسالة للتجربة ولا تُرسل إلى المطعم. استخدم بيانات وهمية.
        </p>
      )}
    </form>
  );
}
