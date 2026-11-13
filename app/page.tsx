import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Instagram, MapPin } from "lucide-react";
import { ArrowLink, BrandStar } from "@/components/brand";
import { HomeMenu } from "@/components/menu-browser";
import { BranchMap } from "@/components/branch-map";
import { site } from "@/lib/site";
import styles from "./home.module.css";

const campaignPosts = [
  { image: "arrival", title: "البطل وصل", alt: "بطل سوبر صوص أمام محطة قطار بغداد" },
  { image: "train-ticket", title: "السوبر عالطريق", alt: "تذكرة سفر وأكياس سوبر صوص في قطار" },
  { image: "suit-star", title: "نجمة السوبر", alt: "نجمة ذهبية على بدلة البطل البورغندية" },
  {
    image: "mascot-bag",
    title: "السوبر بحجم أكبر",
    alt: "لوحة كبيرة لبطل سوبر صوص يحمل كيس الطلب",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 id="home-title">
              الجوع إله <span>بطل.</span>
            </h1>
            <p>برغر مشوي، دجاج يقرمش، وصوص يخليك ترجع.</p>
            <div className={styles.heroActions}>
              <Link href="/menu" className="button button-yellow">
                شوف المنيو <ArrowLeft size={20} aria-hidden="true" />
              </Link>
              <Link href="#branch-map" className={styles.heroLocation}>
                <MapPin size={18} aria-hidden="true" /> اعثر على أقرب فرع
              </Link>
            </div>
            <div className={styles.heroCaption} lang="en" dir="ltr">
              <BrandStar /> TASTE THE DIFFERENCE
            </div>
          </div>
          <picture className={styles.heroVisual}>
            <img
              src="/images/campaign/hero-star-cutout-960.webp"
              srcSet="/images/campaign/hero-star-cutout-640.webp 640w, /images/campaign/hero-star-cutout-960.webp 960w, /images/campaign/hero-star-cutout-1280.webp 1280w"
              sizes="(max-width: 400px) calc(100vw - 40px), (max-width: 760px) 360px, (max-width: 1350px) 48vw, 640px"
              width={1280}
              height={1086}
              alt="بطل سوبر صوص يقدّم برغر بطبقتين من اللحم والجبن أمام نجمة ذهبية"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
      </section>

      <div className={styles.ribbon}>
        <div className={`container ${styles.ribbonInner}`}>
          <span>صوص أكثر</span>
          <BrandStar />
          <span>قرمشة أعلى</span>
          <BrandStar />
          <span>مزاج سوبر</span>
          <BrandStar />
          <span>نكهة غير</span>
        </div>
      </div>

      <section className={`container ${styles.menu}`} id="home-menu">
        <div className={styles.sectionHead}>
          <div>
            <h2>شنو مشتهي اليوم؟</h2>
            <p>من أول لقمة لآخر غمسة. اختار السوبر مالك.</p>
          </div>
          <ArrowLink href="/menu">المنيو كامل</ArrowLink>
        </div>
        <HomeMenu />
      </section>

      <section className={`container ${styles.foodFeatures}`} aria-label="اختيارات سوبر صوص">
        <Link
          href="/menu?category=chicken"
          className={`${styles.foodFeature} ${styles.chickenFeature}`}
        >
          <Image
            src="/images/campaign/chicken-feast.webp"
            alt=""
            fill
            sizes="(max-width: 760px) 90vw, 56vw"
          />
          <div className={styles.featureCopy}>
            <h2>اللّمة تحلى بالسوبر.</h2>
            <span>
              اختار وجبة اللّمة <ArrowLeft size={18} aria-hidden="true" />
            </span>
          </div>
        </Link>
        <Link
          href="/menu?category=burgers"
          className={`${styles.foodFeature} ${styles.burgerFeature}`}
        >
          <Image
            src="/images/campaign/burger-packaging.webp"
            alt=""
            fill
            sizes="(max-width: 760px) 90vw, 34vw"
          />
          <div className={styles.featureCopy}>
            <h2>عضّة تسوى.</h2>
            <span>
              شوف البرغر <ArrowLeft size={18} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </section>

      <section className={styles.campaign}>
        <div className={`container ${styles.campaignInner}`}>
          <div className={styles.campaignCopy}>
            <h2>
              مو بطل جديد.
              <br />
              <span>نسخة أقوى.</span>
            </h2>
            <p>نجمة جديدة، كاب ذهبي، ونفس الحب للّقمة اللي تجمعنا.</p>
            <ArrowLink href="/about">اقرأ حكاية السوبر</ArrowLink>
          </div>
          <div className={styles.campaignArt}>
            <div className={styles.campaignMain}>
              <Image
                src="/images/campaign/mascot-store.webp"
                alt="بطل سوبر صوص أمام واجهة المطعم بشعارها الجديد"
                fill
                sizes="(max-width: 760px) 70vw, 30vw"
              />
            </div>
            <div className={styles.campaignInset}>
              <Image
                src="/images/campaign/suit-reveal.webp"
                alt=""
                fill
                sizes="(max-width: 760px) 26vw, 15vw"
              />
            </div>
            <BrandStar className={styles.campaignStar} />
          </div>
        </div>
      </section>

      <section className={`container ${styles.sauce}`}>
        <div>
          <h2>
            السر؟
            <br />
            <span>بالصوص.</span>
          </h2>
          <p>كريمي، سموكي، لو حار؟ عدنا صوص على مزاجك.</p>
          <ArrowLink href="/menu?category=sauces">اكتشف صوصك المفضل</ArrowLink>
        </div>
        <Image
          src="/images/sauces.webp"
          alt="صوصات سوبر صوص مع بطاطا للتغميس"
          width={850}
          height={567}
          sizes="(max-width: 760px) 90vw, 50vw"
        />
      </section>

      <BranchMap />

      <section className={`container ${styles.social}`}>
        <div className={styles.sectionHead}>
          <div>
            <h2>كل يوم، سالفة سوبر.</h2>
            <p>تابع مشاهد الحملة وآخر أخبارنا على إنستغرام.</p>
          </div>
          <a
            href={site.instagram}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تابع سوبر صوص على إنستغرام"
          >
            <Instagram size={20} aria-hidden="true" />
            <span dir="ltr">@supersauce.iq</span>
            <ArrowUpLeft size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.socialGrid}>
          {campaignPosts.map(({ image, alt, title }) => (
            <figure key={image}>
              <div>
                <Image
                  src={`/images/campaign/${image}.webp`}
                  alt={alt}
                  fill
                  sizes="(max-width: 760px) 45vw, 24vw"
                />
              </div>
              <figcaption>{title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.close}>
        <div className="container">
          <h2>خلك سوبر.</h2>
          <Link href="/menu" className="button button-dark">
            يلا نطلب؟ <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <BrandStar outline />
        </div>
      </section>
    </>
  );
}
