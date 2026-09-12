"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowLeft, ArrowUpLeft, Clock3 } from "lucide-react";
import { branches, cities, branchMapsUrl } from "@/lib/branches";
import { normalizeArabic } from "@/lib/site";

export function BranchFinder() {
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");
  const visible = branches.filter(
    (b) =>
      (city === "all" || b.city === city) &&
      normalizeArabic(`${b.name} ${b.city} ${b.area} ${b.address}`).includes(
        normalizeArabic(query),
      ),
  );
  return (
    <section className="container branch-directory">
      <div className="branch-controls">
        <div>
          <h2>اعثر على أقرب فرع</h2>
          <p>اختار محافظتك، وشوف تفاصيل الفرع.</p>
        </div>
        <div className="search-field">
          <Search size={20} aria-hidden="true" />
          <label className="sr-only" htmlFor="branch-search">
            ابحث عن فرع أو منطقة
          </label>
          <input
            id="branch-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن فرع أو منطقة..."
          />
        </div>
      </div>
      <div className="category-tabs" aria-label="المحافظات">
        {["all", ...cities].map((c) => (
          <button
            key={c}
            aria-pressed={city === c}
            className={city === c ? "active" : ""}
            onClick={() => setCity(c)}
          >
            {c === "all" ? "كل المحافظات" : c}
          </button>
        ))}
      </div>
      <div className="results-bar">
        <span aria-live="polite">{visible.length} فروع</span>
        <span>أكثر من 23 فرع حول العراق</span>
      </div>
      <div className="branch-grid">
        {visible.map((branch, i) => (
          <article className="branch-card" key={branch.slug}>
            <div className="branch-card-top">
              <MapPin size={28} aria-hidden="true" />
              <span>
                {branch.city} / {branch.area}
              </span>
              <span className="branch-index" dir="ltr">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>
              <Link href={`/branches/${branch.slug}`}>{branch.name}</Link>
            </h3>
            <p>{branch.address}</p>
            <div className="branch-hours">
              <Clock3 size={17} aria-hidden="true" />
              <span>{branch.hours}</span>
            </div>
            <ul className="service-tags">
              {branch.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="branch-card-bottom">
              <Link href={`/branches/${branch.slug}`} className="text-link">
                تفاصيل الفرع <ArrowLeft size={18} />
              </Link>
              <a
                href={branchMapsUrl(branch)}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                بحث بالخريطة <ArrowUpLeft size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <MapPin size={44} />
          <h2>ما لقينا فرع بهالبحث.</h2>
          <p>جرّب اسم المنطقة أو اختار محافظة ثانية.</p>
          <button
            className="button button-red"
            onClick={() => {
              setCity("all");
              setQuery("");
            }}
          >
            عرض كل الفروع
          </button>
        </div>
      )}
    </section>
  );
}
