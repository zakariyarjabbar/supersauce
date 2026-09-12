import { pageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { BrandStar, PageIntro } from "@/components/brand";
import { ContactForm } from "@/components/contact-form";
import { getContactDeliveryConfig } from "@/lib/contact-delivery";

export const metadata = pageMetadata({
  path: "/careers",
  title: "انضم للفريق",
  description: "تحب الشغل بروح الفريق؟ عرّفنا بنفسك واكتشف فرص الانضمام إلى عائلة سوبر صوص.",
});
export default function CareersPage() {
  return (
    <>
      <PageIntro
        title="الفريق يصير بيك سوبر."
        text="الطعم الحلو وراه ناس تحب شغلها. إذا عندك هالروح، نحب نتعرّف عليك."
        color="red"
      />
      <section className="container contact-layout careers-layout">
        <aside className="contact-aside">
          <div className="career-photo">
            <Image
              src="/images/restaurant.webp"
              alt="واجهة سوبر صوص وإضاءتها الدافئة"
              width={700}
              height={500}
              sizes="(max-width: 760px) 100vw, 40vw"
            />
          </div>
          <h2>
            شغف. تعاون.
            <br />
            ومزاج سوبر.
          </h2>
          <p>من المطبخ لخدمة الزبائن، ومن إدارة الفروع للتسويق، كل دور إله أثر بالتجربة.</p>
          <ul className="career-values">
            <li>
              <BrandStar />
              فريق يتعاون ويتعلّم سوا
            </li>
            <li>
              <BrandStar />
              مساحة للمبادرة والأفكار
            </li>
            <li>
              <BrandStar />
              اهتمام بكل تفصيلة
            </li>
          </ul>
          <p className="small-note">للاستفسار عن فرص العمل، عرّفنا بخبرتك والمجال اللي يهمك.</p>
        </aside>
        <ContactForm kind="careers" emailAvailable={!!getContactDeliveryConfig()} />
      </section>
    </>
  );
}
