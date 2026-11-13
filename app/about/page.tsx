import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandStar, CtaBand } from "@/components/brand";

export const metadata = pageMetadata({
  path: "/about",
  title: "حكاية السوبر",
  description: "حكاية سوبر صوص: برغر، صوص، ولمّة عراقية. تعرّف على الروح وراء كل لقمة.",
});
export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="مسار التصفح">
            <Link href="/">الرئيسية</Link>
            <span aria-hidden="true">/</span>
            <span>حكاية السوبر</span>
          </nav>
          <div className="about-hero-layout">
            <div className="about-hero-copy">
              <h1>
                حكايتنا بسيطة.
                <span>طعم يبقى بالبال.</span>
              </h1>
              <p>كلّنا عدنا هذيك اللقمة اللي نرجعلها. نريد نكون لقمتك، ومكانك، وسالفة لمّتك.</p>
            </div>
            <div className="about-hero-art">
              <BrandStar className="about-hero-star" outline />
              <figure className="about-portrait">
                <Image
                  src="/images/campaign/mascot-store.webp"
                  alt="بطل سوبر صوص بعباءته الذهبية أمام الواجهة بالشعار الجديد"
                  width={456}
                  height={644}
                  preload
                  sizes="(max-width: 760px) min(360px, 90vw), min(385px, 36vw)"
                />
                <figcaption>
                  <BrandStar /> من العراق، وبمزاج عراقي.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section className="section container story-grid">
        <h2>
          إحنا سوبر صوص.
          <br />
          <span>والاسم يحچي.</span>
        </h2>
        <div>
          <p className="lead-text">
            نؤمن إن البرغر الحلو ما يحتاج سالفة طويلة. يحتاج مكونات تجتمع صح، قرمشة بوقتها، وصوص
            يكمل كل لقمة.
          </p>
          <p>
            سوبر صوص هو مكان الطلعة العفوية، وقعدة الأصحاب، و«خل نطلب شي حلو». من البرغر والدجاج إلى
            فرايز آخر الليل، كل اختيار إله مزاج.
          </p>
          <p>
            ومع أكثر من 23 فرع حول العراق، اللّمة تكبر. نقرّب الطعم اللي تحبه، ونخلّي كل زيارة بيها
            شي سوبر.
          </p>
          <Link className="text-link" href="/branches">
            شوف وين تلقانا <ArrowLeft size={19} />
          </Link>
        </div>
      </section>
      <section className="about-values">
        <div className="container">
          <h2>هذا اللي يخلّينا سوبر.</h2>
          <div className="values-list">
            {[
              {
                title: "الصوص إله كلمة.",
                text: "كل صوص إله شخصيته. كريمي، حار، أو مدخّن، اختار اللمسة اللي تشبه ذوقك.",
              },
              {
                title: "اللّمة أحلى.",
                text: "من وجبة لشخص إلى بوكس للأصحاب، عدنا مساحة لكل شهية ولكل قعدة.",
              },
              {
                title: "على مزاجك.",
                text: "تحبها سبايسي؟ دبل جبن؟ صوص زيادة؟ المنيو بداية الحكاية، والباقي ذوقك.",
              },
            ].map((v) => (
              <article key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
                <BrandStar />
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container about-place">
        <div>
          <h2>
            مو بس وجبة.
            <br />
            مكان يجمعنا.
          </h2>
          <p>عنّابي تعرفه من بعيد، لمّة ترتاحلها، وطعم يخليك ترجع. هذا عالم سوبر صوص.</p>
          <Link href="/careers" className="button button-red">
            صير جزء من الفريق <ArrowLeft size={19} />
          </Link>
        </div>
        <div className="about-place-art">
          <Image
            src="/images/campaign/mascot-bag.webp"
            alt="بطل سوبر صوص يحمل كيس الوجبة في إعلان الحملة"
            width={434}
            height={624}
            sizes="(max-width: 760px) 85vw, 28vw"
          />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
