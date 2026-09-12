import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { PageIntro, CtaBand } from "@/components/brand";
import { MenuBrowser } from "@/components/menu-browser";

export const metadata = pageMetadata({
  path: "/menu",
  title: "المنيو",
  description:
    "منيو سوبر صوص الكامل: كرسكت، برجر، ساندويشات، بروستد، ستربس، فرايز، ريزو، صوصات ومشروبات. الأسعار بالدينار العراقي.",
});
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
