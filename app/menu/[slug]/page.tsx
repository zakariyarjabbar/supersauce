import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, Info } from "lucide-react";
import { getMenuItem, menuItems, categories } from "@/lib/menu";
import { formatPrice } from "@/lib/site";
import { ProductPurchase, FoodCard } from "@/components/menu-browser";
import { ArrowLink } from "@/components/brand";

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
    ? {
        title: item.name,
        description: item.description,
        openGraph: {
          title: `${item.name} | سوبر صوص`,
          description: item.description,
          images: [{ url: item.image, alt: item.imageAlt }],
        },
      }
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
        <div className={`product-image ${item.category === "burgers" ? "red-photo" : ""}`}>
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={900}
            height={700}
            priority
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
          <p>{item.description}</p>
          <div className="product-price">
            <b dir="ltr">{formatPrice(item.price)}</b>
            <span>د.ع</span>
          </div>
          <h2>شنو بيها؟</h2>
          <ul className="ingredient-list">
            {item.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <ProductPurchase item={item} />
          <p className="product-notice">
            <Info size={17} />
            عندك حساسية غذائية؟ تأكد من المكونات مع الفرع قبل الطلب. الصورة والسعر للتوضيح في نسخة
            العرض.
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
