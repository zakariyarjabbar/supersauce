import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandStar, CtaBand } from "@/components/brand";

export const metadata: Metadata = {
  title: "حكاية السوبر",
  description: "حكاية سوبر صوص: برغر، صوص، ولمّة عراقية. تعرّف على الروح وراء كل لقمة.",
};
export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="مسار التصفح">
            <Link href="/">الرئيسية</Link>
            <span>/</span>
            <span>حكاية السوبر</span>
          </nav>
          <h1>
            حكايتنا بسيطة.
            <br />
            <span>طعم يبقى بالبال.</span>
          </h1>
          <p>
            كلّنا عدنا هذيك اللقمة اللي نرجعلها.
            <br />
            نريد نكون لقمتك، ومكانك، وسالفة لمّتك.
          </p>
          <BrandStar className="about-hero-star" />
        </div>
      </section>
      <div className="about-wide-photo">
        <Image
          src="/images/sharing-meal.webp"
          alt="لمّة من وجبات سوبر صوص المتنوعة على سفرة حمراء"
          fill
          priority
          sizes="100vw"
        />
        <div className="about-photo-note">
          من العراق.
          <br />
          وبمزاج عراقي.
        </div>
      </div>
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
          <p>لون أحمر تعرفه من بعيد، لمّة ترتاحلها، وطعم يخليك ترجع. هذا عالم سوبر صوص.</p>
          <Link href="/careers" className="button button-red">
            صير جزء من الفريق <ArrowLeft size={19} />
          </Link>
        </div>
        <div>
          <Image
            src="/images/restaurant.webp"
            alt="تصوّر تصميمي لواجهة مطعم سوبر صوص بالأحمر والأبيض"
            width={900}
            height={600}
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <p className="small-note">صورة تصوّرية لهوية المكان.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
