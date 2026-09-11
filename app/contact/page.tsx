import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Instagram, ArrowUpLeft, MapPin, ArrowLeft, MessageCircle, Utensils } from "lucide-react";
import { PageIntro } from "@/components/brand";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/contact",
  title: "نسمعك",
  description: "عندك سؤال أو اقتراح؟ تواصل مع سوبر صوص وشاركنا رأيك.",
});
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const initialTopic = (await searchParams).subject === "partnership" ? "تعاون وشراكات" : "";
  return (
    <>
      <PageIntro
        title="نسمعك، بكل حب."
        text="السوبر يكمل برأيكم. احچيلنا عن تجربتك، أو خلّينا نجاوب على اللي ببالك."
      />
      <section className="container contact-layout">
        <aside className="contact-aside">
          <h2>
            السالفة تبدأ
            <br />
            برسالة.
          </h2>
          <p>استفسار صغير أو فكرة كبيرة، نحب نسمع منك. اختار الطريقة اللي تناسبك.</p>
          <a
            className="contact-channel"
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={25} />
            <span>
              <b>تعال للإنستغرام</b>
              <small dir="ltr">@supersauce.iq</small>
            </span>
            <ArrowUpLeft size={21} />
          </a>
          <Link className="contact-channel" href="/branches">
            <MapPin size={25} />
            <span>
              <b>مرّ علينا</b>
              <small>شوف دليل الفروع</small>
            </span>
            <ArrowLeft size={21} />
          </Link>
          <Link className="contact-channel" href="/faq">
            <MessageCircle size={25} />
            <span>
              <b>جوابك يمكن هنا</b>
              <small>الأسئلة الشائعة</small>
            </span>
            <ArrowLeft size={21} />
          </Link>
          <div className="contact-order-note">
            <Utensils size={24} />
            <h3>جوعان ومستعجل؟</h3>
            <p>تصفح المنيو واختار وجبتك، بعدها تواصل مباشرة مع المطعم للطلب.</p>
            <Link className="text-link" href="/menu">
              يلا نختار <ArrowLeft size={18} />
            </Link>
          </div>
        </aside>
        <ContactForm initialTopic={initialTopic} />
      </section>
    </>
  );
}
