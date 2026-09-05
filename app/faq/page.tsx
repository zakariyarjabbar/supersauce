import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/brand";
import { FaqList } from "@/components/faq-list";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "كل ما تريد تعرفه عن منيو سوبر صوص، الفروع، الطلبات والمفضلة.",
};
export default function FaqPage() {
  return (
    <>
      <PageIntro
        title="بالك مشغول بسؤال؟"
        text="جمعنا أكثر الأسئلة اللي ممكن تخطر ببالك. جوابك يمكن هنا."
      />
      <section className="container faq-content">
        <FaqList />
        <div className="faq-contact">
          <h2>بعدك عندك سؤال؟</h2>
          <p>نحب نسمع منك ونساعدك.</p>
          <Link href="/contact" className="button button-red">
            احچيلنا <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
