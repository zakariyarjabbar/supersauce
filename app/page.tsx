import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDown,
  MapPin,
  Instagram,
  ArrowUpLeft,
  Utensils,
  Heart,
  Flame,
} from "lucide-react";
import { BrandStar, ArrowLink } from "@/components/brand";
import { HomeMenu } from "@/components/menu-browser";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-word" aria-hidden="true">
          SUPER SAUCE
        </div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>
              مو بس برغر.
              <br />
              <span>هذا سوبر.</span>
            </h1>
            <p>
              لحم مشوي، قرمشة غير شكل، وصوص
              <br className="desktop-break" /> يخلّي كل لقمة أحلى من الثانية.
            </p>
            <div className="hero-buttons">
              <Link href="/menu" className="button button-yellow">
                شوف المنيو <ArrowLeft size={20} />
              </Link>
              <Link href="/branches" className="hero-location">
                <MapPin size={19} /> لكه أقرب فرع
              </Link>
            </div>
            <div className="hero-proof">
              <span className="mini-stars">
                <BrandStar />
                <BrandStar />
                <BrandStar />
              </span>
              <span>
                لمة تكبر، وأكثر من <b>23 فرع</b> حول العراق.
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Image
              className="hero-burger"
              src="/images/hero-burger.webp"
              alt="برغر سوبر صوص بطبقتين من اللحم المشوي والجبن الذائب والصوص"
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 100vw, 60vw"
              priority
              fetchPriority="high"
            />
            <div className="hero-stamp">
              <BrandStar />
              <span>
                سرّ
                <br />
                الطعم!
              </span>
            </div>
            <svg
              className="hero-doodle"
              viewBox="0 0 140 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path
                d="M130 8C97 0 32 8 40 33c8 23 37 4 26-8-12-14-48 2-49 47m-12-8 12 15 18-11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="burger-caption">لقمة وتعرف السالفة.</span>
          </div>
          <a className="hero-scroll" href="#home-menu" aria-label="اكتشف المنيو">
            <ArrowDown size={19} />
          </a>
        </div>
        <BrandStar className="hero-star-one" outline />
      </section>
      <div className="flavor-ribbon" aria-label="صوص أكثر، طعم أكبر، مزاج سوبر">
        <div>
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} aria-hidden={index > 0}>
              صوص أكثر
              <BrandStar />
              طعم أكبر
              <BrandStar />
              مزاج سوبر
              <BrandStar />
            </span>
          ))}
        </div>
      </div>
      <section className="section container" id="home-menu">
        <div className="section-heading">
          <div>
            <h2>شنو مشتهي اليوم؟</h2>
            <p>من أول لقمة لآخر صوص. اختار السوبر مالك.</p>
          </div>
          <ArrowLink href="/menu">المنيو كامل</ArrowLink>
        </div>
        <HomeMenu />
      </section>
      <section className="sharing-section container">
        <div className="sharing-copy">
          <h2>
            اللّمة تحلى
            <br />
            بالسوبر.
          </h2>
          <p>
            للمباراة، للطلعة، أو لقعدة «شنو ناكل؟».
            <br />
            بوكساتنا تجمع كل الأذواق على سفرة وحدة.
          </p>
          <Link href="/menu?category=boxes" className="button button-yellow">
            اختار بوكس اللمة <ArrowLeft size={19} />
          </Link>
          <BrandStar outline className="sharing-star" />
        </div>
        <div className="sharing-photo">
          <Image
            src="/images/sharing-meal.webp"
            alt="سفرة للمشاركة من البرغر والدجاج المقرمش والفرايز"
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
          />
          <span className="sharing-note">
            لمّ أصحابك.
            <br />
            وخلي الباقي علينا.
          </span>
        </div>
      </section>
      <section className="sauce-section section container">
        <div className="sauce-art">
          <Image
            src="/images/sauces.webp"
            alt="صوص السوبر الكريمي، صوص الشيدر والصوص الحار مع بطاطا للتغميس"
            width={850}
            height={567}
            sizes="(max-width: 760px) 95vw, 50vw"
          />
          <span className="sauce-doodle">
            <BrandStar />
          </span>
        </div>
        <div className="sauce-copy">
          <h2>
            السر؟
            <br />
            <span>بالصوص.</span>
          </h2>
          <p>
            مو صدفة اسمنا سوبر صوص. نعرف إن اللمسة الأخيرة هي اللي تسوي الفرق. كريمي، سموكي، لو حار؟
            عدنا صوص على مزاجك.
          </p>
          <ArrowLink href="/menu?category=sauces">اكتشف صوصك المفضل</ArrowLink>
          <div className="sauce-flavors">
            <span>
              <Utensils size={17} /> كريمي
            </span>
            <span>
              <Flame size={17} /> حار
            </span>
            <span>
              <Heart size={17} /> على مزاجك
            </span>
          </div>
        </div>
      </section>
      <section className="branches-teaser">
        <div className="container branch-teaser-inner">
          <div className="branches-copy">
            <h2>
              وين ما تكون،
              <br />
              السوبر قريب.
            </h2>
            <p>
              أكثر من 23 فرع حول العراق.
              <br />
              نفس اللمة، ونفس الطعم اللي تحبه.
            </p>
            <Link href="/branches" className="button button-yellow">
              لكه أقرب فرع <MapPin size={20} />
            </Link>
          </div>
          <div className="branch-poster">
            <span className="branch-big-number" dir="ltr">
              23<span>+</span>
            </span>
            <span className="branch-big-label">فرع حول العراق</span>
            <BrandStar className="branch-poster-star" />
            <div className="city-names">
              <span>بغداد</span>
              <span>بابل</span>
              <span>كربلاء</span>
              <span>النجف</span>
            </div>
          </div>
        </div>
        <div className="checker-border" />
      </section>
      <section className="section container social-section">
        <div className="section-heading">
          <div>
            <h2>كل يوم، سالفة سوبر.</h2>
            <p>الطعم إله صورة. تابعنا وشوف شنو عدنا.</p>
          </div>
          <a href={site.instagram} className="text-link" target="_blank" rel="noopener noreferrer">
            <Instagram size={20} />
            <span dir="ltr">@supersauce.iq</span>
            <ArrowUpLeft size={20} />
          </a>
        </div>
        <div className="social-grid">
          {[
            { image: "hero-burger", label: "دبل الطعم." },
            { image: "sharing-meal", label: "اللّمة علينا." },
            { image: "fried-chicken", label: "قرمشة تستاهل." },
            { image: "restaurant", label: "مكانك يمّنا." },
          ].map((post, i) => (
            <a
              key={post.image}
              className={`social-tile social-tile-${i}`}
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${post.label} تابع سوبر صوص على إنستغرام`}
            >
              <Image
                src={`/images/${post.image}.webp`}
                alt={post.label}
                fill
                sizes="(max-width: 760px) 45vw, 25vw"
              />
              <div>
                <span>{post.label}</span>
                <ArrowUpLeft size={22} />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="home-close">
        <div className="container">
          <h2>
            خلك <span>سوبر.</span>
          </h2>
          <Link href="/menu" className="button button-dark">
            يلا نطلب؟ <ArrowLeft size={20} />
          </Link>
          <BrandStar />
        </div>
      </section>
    </>
  );
}
