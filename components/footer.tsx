import Link from "next/link";
import { Instagram, ArrowUpLeft } from "lucide-react";
import { Logo, BrandStar } from "./brand";
import { site } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo footer />
            <p>
              طعم يجمعنا.
              <br />
              وصوص يخلّينا نرجع.
            </p>
            <a
              className="social-link"
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="سوبر صوص على إنستغرام، يفتح في نافذة جديدة"
            >
              <Instagram size={21} />
              <span dir="ltr">@supersauce.iq</span>
              <ArrowUpLeft size={16} />
            </a>
          </div>
          <div className="footer-column">
            <h3>عالم السوبر</h3>
            <Link href="/menu">المنيو</Link>
            <Link href="/branches">فروعنا</Link>
            <Link href="/about">حكايتنا</Link>
            <Link href="/order">طلبك</Link>
          </div>
          <div className="footer-column">
            <h3>خلّينا على تواصل</h3>
            <Link href="/contact">نسمعك</Link>
            <Link href="/careers">انضم للفريق</Link>
            <Link href="/faq">أسئلة على بالك</Link>
            <Link href="/contact?subject=partnership">تعاون ويّانا</Link>
          </div>
          <div className="footer-signoff">
            <BrandStar />
            <span>
              من العراق،
              <br />
              بكل حب.
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} سوبر صوص.</span>
          <div>
            <Link href="/privacy">الخصوصية</Link>
            <Link href="/terms">شروط الاستخدام</Link>
          </div>
        </div>
        {site.demo && (
          <p className="demo-notice">
            <span>نسخة عرض</span>تصوّر مستقل للموقع. الصور، الأسعار، بيانات الفروع والطلبات توضيحية؛
            لا تُرسل الطلبات إلى المطعم.
          </p>
        )}
      </div>
    </footer>
  );
}
