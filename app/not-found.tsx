import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandStar } from "@/components/brand";
export default function NotFound() {
  return (
    <section className="container not-found">
      <div className="error-number" dir="ltr">
        4<BrandStar />4
      </div>
      <h1>هالصفحة مو بالمنيو.</h1>
      <p>يمكن الرابط تغيّر، بس لقمتك المفضلة بعدها موجودة.</p>
      <Link className="button button-red" href="/menu">
        نرجع للمنيو <ArrowLeft size={20} />
      </Link>
      <Link className="text-link" href="/">
        أو نرجع للرئيسية
      </Link>
    </section>
  );
}
