import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/brand";
import { OrderFlow } from "@/components/order-flow";

export const metadata: Metadata = { title: "طلبك", robots: { index: false, follow: false } };
export default function OrderPage() {
  return (
    <>
      <PageIntro
        title="طلبك، على مزاجك."
        text="وجبتك المفضلة وصوصك اللي تحبه. باقي خطوة وتكمل التجربة."
      />
      <Suspense
        fallback={
          <div className="container loading-content" role="status">
            نحضّر طلبك...
          </div>
        }
      >
        <OrderFlow />
      </Suspense>
    </>
  );
}
