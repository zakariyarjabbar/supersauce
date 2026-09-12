import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, Info } from "lucide-react";
import { getMenuItem, menuItems, categories } from "@/lib/menu";
import { formatPrice } from "@/lib/site";
import { FoodCard } from "@/components/menu-browser";
import { OrderButton } from "@/components/order-options";
import { ArrowLink } from "@/components/brand";
import { pageMetadata, photoShareImage } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return menuItems.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = getMenuItem((await params).slug);
  return item
    ? pageMetadata({
        path: `/menu/${item.slug}`,
        title: item.name,
        description: `${item.name} — ${formatPrice(item.price)} د.ع. ${item.description}`,
        image: photoShareImage(item.image, item.imageAlt),
      })
    : { title: "الوجبة غير موجودة" };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getMenuItem((await params).slug);
  if (!item) notFound();
  const related = [
    ...menuItems.filter((x) => x.category === item.category && x.slug !== item.slug),
    ...menuItems.filter((x) => x.category === "sides" && x.slug !== item.slug),
  ]
    .filter((x, i, a) => a.findIndex((y) => y.slug === x.slug) === i)
    .slice(0, 4);
  return (
    <div className="container content-page">
      <nav className="breadcrumb" aria-label="مسار التصفح">
        <Link href="/">الرئيسية</Link>
        <span>/</span>
        <Link href="/menu">المنيو</Link>
        <span>/</span>
        <span>{item.name}</span>
      </nav>
      <section className="product-detail">
        <div className="product-image">
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={900}
            height={600}
            preload
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          {item.tag && (
            <span className="food-tag">
              {item.spicy && <Flame size={15} />}
              {item.tag}
            </span>
          )}
        </div>
        <div className="product-copy">
          <Link className="product-category" href={`/menu?category=${item.category}`}>
            {categories.find((c) => c.id === item.category)?.label}
          </Link>
          <h1>{item.name}</h1>
          <span className="product-english-name" lang="en" dir="ltr">
            {item.englishName}
          </span>
          <p>{item.description}</p>
          <div className="product-price">
            <b dir="ltr">{formatPrice(item.price)}</b>
            <span>د.ع</span>
            {item.mealUpgrade && <small>ساندويش</small>}
            {item.sizes && <small>{item.sizes[0].label}</small>}
          </div>
          {(item.sizes || item.mealUpgrade || item.cheeseExtra) && (
            <dl className="product-price-options">
              {item.sizes?.map((size) => (
                <div key={size.label}>
                  <dt>{size.label}</dt>
                  <dd>
                    <b dir="ltr">{formatPrice(size.price)}</b> د.ع
                  </dd>
                </div>
              ))}
              {item.mealUpgrade && (
                <div>
                  <dt>
                    مع وجبة <small>(+{formatPrice(item.mealUpgrade)} د.ع)</small>
                  </dt>
                  <dd>
                    <b dir="ltr">{formatPrice(item.price + item.mealUpgrade)}</b> د.ع
                  </dd>
                </div>
              )}
              {item.cheeseExtra && (
                <div>
                  <dt>إضافة جبن</dt>
                  <dd>
                    +<b dir="ltr">{formatPrice(item.cheeseExtra)}</b> د.ع
                  </dd>
                </div>
              )}
            </dl>
          )}
          {item.ingredients.length > 0 && (
            <>
              <h2>شنو بيها؟</h2>
              <ul className="ingredient-list">
                {item.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </>
          )}
          <OrderButton item={item} className="button button-red product-order-button" />
          <p className="product-notice">
            <Info size={17} />
            عندك حساسية غذائية؟ تأكد من المكونات مع الفرع قبل الطلب. الصورة توضيحية محسّنة، والسعر
            حسب المنيو.
          </p>
        </div>
      </section>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <h2>وياها، تصير أحلى.</h2>
            <p>كمّل الوجبة على مزاجك.</p>
          </div>
          <ArrowLink href="/menu">كل المنيو</ArrowLink>
        </div>
        <div className="food-grid">
          {related.map((product) => (
            <FoodCard key={product.slug} item={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
