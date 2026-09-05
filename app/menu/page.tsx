import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro, CtaBand } from "@/components/brand";
import { MenuBrowser } from "@/components/menu-browser";

export const metadata: Metadata = {
  title: "المنيو",
  description: "برغر، دجاج مقرمش، فرايز وصوصات. اختار وجبتك المفضلة من منيو سوبر صوص.",
};
export default function MenuPage() {
  return (
    <>
      <PageIntro
        title="كل لقمة، سالفة."
        text="برغر يضبط المزاج، قرمشة تسمعها، وصوص ما ينشبع منه. هذا المنيو مالك."
      />
      <Suspense
        fallback={
          <div className="container loading-content" role="status">
            نحضّر لك المنيو...
          </div>
        }
      >
        <MenuBrowser />
      </Suspense>
      <CtaBand />
    </>
  );
}
