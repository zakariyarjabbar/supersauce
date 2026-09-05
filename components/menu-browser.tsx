"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Heart, Search, X, SlidersHorizontal, Flame, Minus } from "lucide-react";
import { categories, menuItems, type MenuItem, type Category } from "@/lib/menu";
import { formatPrice, normalizeArabic } from "@/lib/site";
import { useCart } from "./cart-provider";

export function FoodCard({ item }: { item: MenuItem }) {
  const { add, favorites, toggleFavorite } = useCart();
  const favorite = favorites.includes(item.slug);
  return (
    <article className="food-card">
      <div className={`food-photo ${item.category === "burgers" ? "red-photo" : ""}`}>
        <Link href={`/menu/${item.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={600}
            height={400}
            sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw"
          />
        </Link>
        {item.tag && (
          <span className={`food-tag ${item.spicy ? "spicy" : ""}`}>
            {item.spicy && <Flame size={13} aria-hidden="true" />}
            {item.tag}
          </span>
        )}
        <button
          className={`favorite icon-button ${favorite ? "selected" : ""}`}
          aria-label={`${favorite ? "إزالة" : "حفظ"} ${item.name} ${favorite ? "من" : "في"} المفضلة`}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(item.slug)}
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="food-info">
        <h3>
          <Link href={`/menu/${item.slug}`}>{item.name}</Link>
        </h3>
        <p>{item.description}</p>
        <div className="food-bottom">
          <span className="price">
            <b dir="ltr">{formatPrice(item.price)}</b> <small>د.ع</small>
          </span>
          <button
            className="add-button"
            onClick={() => add(item.slug)}
            aria-label={`أضف ${item.name} إلى الطلب`}
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function HomeMenu() {
  const [category, setCategory] = useState<Category>("all");
  const visible = (
    category === "all"
      ? menuItems.filter((x) => x.featured)
      : menuItems.filter((x) => x.category === category)
  ).slice(0, 4);
  return (
    <>
      <div className="category-tabs" aria-label="تصنيفات المنيو">
        {categories.map((c) => (
          <button
            key={c.id}
            aria-pressed={category === c.id}
            className={category === c.id ? "active" : ""}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="food-grid" aria-live="polite">
        {visible.map((item) => (
          <FoodCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  );
}

export function MenuBrowser() {
  const params = useSearchParams();
  const fromUrl = params.get("category");
  const [category, setCategory] = useState<Category>(
    categories.find((c) => c.id === fromUrl)?.id || "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [savedOnly, setSavedOnly] = useState(false);
  const { favorites } = useCart();
  const items = menuItems.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      (!savedOnly || favorites.includes(item.slug)) &&
      normalizeArabic(`${item.name} ${item.description}`).includes(normalizeArabic(query)),
  );
  if (sort !== "recommended")
    items.sort((a, b) => (sort === "low" ? a.price - b.price : b.price - a.price));
  const changeCategory = (id: Category) => {
    setCategory(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
  };
  const reset = () => {
    changeCategory("all");
    setQuery("");
    setSavedOnly(false);
    setSort("recommended");
  };
  return (
    <div className="container menu-content">
      <div className="menu-toolbar">
        <div className="search-field">
          <Search size={20} aria-hidden="true" />
          <label className="sr-only" htmlFor="menu-search">
            ابحث في المنيو
          </label>
          <input
            id="menu-search"
            type="search"
            placeholder="برغر، دجاج، فرايز... شنو ببالك؟"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="icon-button" aria-label="مسح البحث" onClick={() => setQuery("")}>
              <X size={18} />
            </button>
          )}
        </div>
        <button
          className={`filter-button ${savedOnly ? "active" : ""}`}
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          <Heart size={19} fill={savedOnly ? "currentColor" : "none"} /> المفضلة
          {favorites.length ? ` (${favorites.length})` : ""}
        </button>
      </div>
      <div className="category-tabs" aria-label="تصنيفات المنيو">
        {categories.map((c) => (
          <button
            key={c.id}
            className={category === c.id ? "active" : ""}
            aria-pressed={category === c.id}
            onClick={() => changeCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="results-bar">
        <span aria-live="polite">{items.length} اختيار على ذوقك</span>
        <label>
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span className="sr-only">ترتيب المنيو</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recommended">ترتيب السوبر</option>
            <option value="low">السعر: من الأقل</option>
            <option value="high">السعر: من الأعلى</option>
          </select>
        </label>
      </div>
      {items.length ? (
        <div className="food-grid">
          {items.map((item) => (
            <FoodCard item={item} key={item.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={44} />
          <h2>{savedOnly ? "بعدك ما اخترت مفضلتك" : "ما لقينا هالاختيار"}</h2>
          <p>
            {savedOnly
              ? "اضغط على القلب جنب الوجبة حتى ترجع إلها بسهولة."
              : "جرّب اسم أقصر، أو شوف كل المنيو."}
          </p>
          <button className="button button-red" onClick={reset}>
            شوف كل المنيو <ArrowLeft size={18} />
          </button>
        </div>
      )}
      <p className="small-note">الصور توضيحية. تفاصيل المكونات والأسعار قابلة للتغيير حسب الفرع.</p>
    </div>
  );
}

export function ProductPurchase({ item }: { item: MenuItem }) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  return (
    <>
      <div className="purchase-row">
        <div className="quantity-control">
          <button
            disabled={quantity >= 20}
            aria-label="زيادة الكمية"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={17} />
          </button>
          <output aria-label="الكمية">{quantity}</output>
          <button
            disabled={quantity <= 1}
            aria-label="تقليل الكمية"
            onClick={() => setQuantity((q) => q - 1)}
          >
            <Minus size={17} />
          </button>
        </div>
        <button className="button button-red" onClick={() => add(item.slug, quantity)}>
          أضف لطلبك <span dir="ltr">{formatPrice(item.price * quantity)}</span> د.ع{" "}
          <Plus size={18} />
        </button>
      </div>
      <Link className="text-link" href="/order">
        كمّل طلبك <ArrowLeft size={19} />
      </Link>
    </>
  );
}
