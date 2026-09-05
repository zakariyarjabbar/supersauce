import type { Metadata } from "next";
import { BrandStar, PageIntro, CtaBand } from "@/components/brand";
import { BranchFinder } from "@/components/branch-finder";

export const metadata: Metadata = {
  title: "فروعنا",
  description: "سوبر صوص قريب منك. استكشف الفروع حسب المحافظة وتعرّف على الخدمات وأوقات العمل.",
};
export default function BranchesPage() {
  return (
    <>
      <PageIntro
        title="السوبر قريب منك."
        text="من بغداد، لكل لمّة حلوة بالعراق. أكثر من 23 فرع يجمعنا وياكم."
        color="red"
      >
        <div className="intro-number">
          <b dir="ltr">23+</b>
          <span>فرع حول العراق</span>
          <BrandStar />
        </div>
      </PageIntro>
      <BranchFinder />
      <CtaBand />
    </>
  );
}
