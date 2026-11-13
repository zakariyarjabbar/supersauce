import Link from "next/link";
import { Instagram, ArrowUpLeft } from "lucide-react";
import { Logo, BrandStar } from "./brand";
import { site } from "@/lib/site";
import styles from "./site-shell.module.css";
export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Logo footer />
            <p>
              طعم يجمعنا.
              <br />
              وصوص يخلّينا نرجع.
            </p>
            <a
              className={styles.socialLink}
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
          <div className={styles.footerColumn}>
            <h3>عالم السوبر</h3>
            <Link href="/menu">المنيو</Link>
            <Link href="/branches">فروعنا</Link>
            <Link href="/about">حكايتنا</Link>
          </div>
          <div className={styles.footerColumn}>
            <h3>خلّينا على تواصل</h3>
            <Link href="/contact">نسمعك</Link>
            <Link href="/careers">انضم للفريق</Link>
            <Link href="/faq">أسئلة على بالك</Link>
            <Link href="/contact?subject=partnership">تعاون ويّانا</Link>
          </div>
          <div className={styles.footerSignoff}>
            <BrandStar outline />
            <span lang="en" dir="ltr">
              TASTE THE
              <br />
              DIFFERENCE.
            </span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} سوبر صوص.</span>
          <div>
            <Link href="/privacy">الخصوصية</Link>
            <Link href="/terms">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
