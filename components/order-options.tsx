"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpLeft, Instagram, MessageCircle, Phone, X } from "lucide-react";
import { formatPrice, site } from "@/lib/site";
import {
  getOrderContactLinks,
  getOrderDetails,
  type OrderSelection,
  type OrderOptions,
} from "@/lib/order-contact";

const OrderContext = createContext<((selection: OrderSelection) => void) | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<OrderSelection | null>(null);
  const [options, setOptions] = useState<OrderOptions>({});
  const details = selection?.item ? getOrderDetails(selection.item, options) : null;
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const links = getOrderContactLinks({
    phone: site.orderPhone,
    whatsapp: site.orderWhatsapp,
    ...selection,
    options,
  });

  useEffect(() => {
    const modal = dialog.current;
    if (!selection || !modal) return;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selection]);

  const channels = [
    { name: "اتصال هاتفي", detail: "احچي ويانا واطلب مباشرة", href: links.phone, icon: Phone },
    {
      name: "واتساب",
      detail: selection?.item ? "ابدأ محادثة باسم الوجبة" : "راسلنا بتفاصيل طلبك",
      href: links.whatsapp,
      icon: MessageCircle,
    },
    {
      name: "إنستغرام",
      detail: "افتح حسابنا وراسلنا بطلبك",
      href: site.instagram,
      icon: Instagram,
    },
  ];

  return (
    <OrderContext.Provider
      value={(next) => {
        setOptions({});
        setSelection(next);
      }}
    >
      {children}
      <dialog
        ref={dialog}
        className="order-dialog"
        aria-labelledby="order-options-title"
        aria-describedby="order-options-description"
        onClose={() => setSelection(null)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href], button:not(:disabled), input:not(:disabled)",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onPointerDown={(event) => {
          backdropPress.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          if (backdropPress.current && event.target === event.currentTarget) {
            dialog.current?.close();
          }
          backdropPress.current = false;
        }}
      >
        <div className="order-dialog-heading">
          <h2 id="order-options-title">شلون تحب تطلب؟</h2>
          <button
            type="button"
            className="icon-button order-dialog-close"
            aria-label="إغلاق خيارات الطلب"
            onClick={() => dialog.current?.close()}
            autoFocus
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="order-dialog-content">
          <p id="order-options-description">
            اختار وسيلة التواصل اللي تناسبك وأكمل طلبك مباشرة مع المطعم.
          </p>
          {selection?.item && (
            <div className="order-selected-item">
              <Image src={selection.item.image} alt="" width={80} height={80} sizes="80px" />
              <div>
                <h3>{selection.item.name}</h3>
                <span className="price">
                  <b dir="ltr" aria-live="polite">
                    {formatPrice(details!.price)}
                  </b>{" "}
                  <small>د.ع</small>
                </span>
                {details?.label && <small className="order-selection-label">{details.label}</small>}
              </div>
            </div>
          )}
          {selection?.item?.sizes && (
            <fieldset className="order-item-options">
              <legend>اختار الحجم</legend>
              {selection.item.sizes.map((size, index) => (
                <label key={size.label}>
                  <input
                    type="radio"
                    name="wing-size"
                    checked={(options.sizeIndex ?? 0) === index}
                    onChange={() => setOptions({ ...options, sizeIndex: index })}
                  />
                  <span>{size.label}</span>
                  <b>
                    <bdi>{formatPrice(size.price)}</bdi> د.ع
                  </b>
                </label>
              ))}
            </fieldset>
          )}
          {selection?.item?.mealUpgrade && (
            <fieldset className="order-item-options">
              <legend>ساندويش لو وجبة؟</legend>
              {[false, true].map((meal) => (
                <label key={String(meal)}>
                  <input
                    type="radio"
                    name="meal-option"
                    checked={!!options.meal === meal}
                    onChange={() => setOptions({ ...options, meal })}
                  />
                  <span>{meal ? "وجبة" : "ساندويش"}</span>
                  <b>
                    <bdi>
                      {formatPrice(
                        selection.item!.price + (meal ? selection.item!.mealUpgrade! : 0),
                      )}
                    </bdi>{" "}
                    د.ع
                  </b>
                </label>
              ))}
            </fieldset>
          )}
          {selection?.item?.cheeseExtra && (
            <div className="order-item-options">
              <label>
                <input
                  type="checkbox"
                  checked={!!options.cheese}
                  onChange={(event) => setOptions({ ...options, cheese: event.target.checked })}
                />
                <span>إضافة جبن</span>
                <b>
                  +<bdi>{formatPrice(selection.item.cheeseExtra)}</bdi> د.ع
                </b>
              </label>
            </div>
          )}
          {selection?.branchName && (
            <p className="order-branch-name">بخصوص فرع {selection.branchName}</p>
          )}
          <div className="order-channels">
            {channels.map(({ name, detail, href, icon: Icon }) => {
              const content = (
                <>
                  <Icon size={25} aria-hidden="true" />
                  <span>
                    <b>{name}</b>
                    <small>{href ? detail : "غير متاح حالياً"}</small>
                  </span>
                  {href && <ArrowUpLeft size={20} aria-hidden="true" />}
                </>
              );
              return href ? (
                <a
                  key={name}
                  className="order-channel"
                  href={href}
                  target={href.startsWith("https://") ? "_blank" : undefined}
                  rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}
                  aria-label={href.startsWith("https://") ? `${name}، يفتح في نافذة جديدة` : name}
                >
                  {content}
                </a>
              ) : (
                <button key={name} type="button" className="order-channel" disabled>
                  {content}
                </button>
              );
            })}
          </div>
          {!links.phone && !links.whatsapp && (
            <p className="order-availability">للطلب حالياً، تواصل عبر إنستغرام.</p>
          )}
          <p className="order-dialog-note">تأكيد السعر والتوفر والتوصيل يكون مباشرة مع المطعم.</p>
        </div>
      </dialog>
    </OrderContext.Provider>
  );
}

export function OrderButton({
  item,
  branchName,
  className = "button button-red",
  children = "اطلب",
}: OrderSelection & { className?: string; children?: React.ReactNode }) {
  const openOrder = useContext(OrderContext);
  if (!openOrder) throw new Error("OrderProvider is missing");
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-label={item ? `اطلب ${item.name}` : undefined}
      onClick={() => openOrder({ item, branchName })}
    >
      {children}
      <ArrowLeft size={18} aria-hidden="true" />
    </button>
  );
}
