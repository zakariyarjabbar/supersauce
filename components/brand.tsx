import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`logo ${footer ? "logo-footer" : ""}`}
      aria-label="سوبر صوص — الرئيسية"
    >
      <span className="logo-crop">
        <Image
          src="/images/logo-original.webp"
          alt="Super Sauce سوبر صوص"
          width={180}
          height={180}
          priority
        />
      </span>
    </Link>
  );
}
export function BrandStar({
  className = "",
  outline = false,
}: {
  className?: string;
  outline?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`brand-star ${className}`}
      fill={outline ? "none" : "currentColor"}
      stroke={outline ? "currentColor" : "none"}
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="M50 3 64 32 96 37 73 60 78 94 50 78 20 94 26 60 3 37 36 32Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={`text-link ${className}`} href={href}>
      {children}
      <ArrowLeft size={20} aria-hidden="true" />
    </Link>
  );
}
export function PageIntro({
  title,
  text,
  children,
  color = "cream",
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
  color?: "cream" | "red";
}) {
  return (
    <section className={`page-intro ${color}`}>
      <div className="container">
        <nav aria-label="مسار التصفح" className="breadcrumb">
          <Link href="/">الرئيسية</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <div className="intro-row">
          <div>
            <h1>{title}</h1>
            <p>{text}</p>
          </div>
          {children || <BrandStar outline />}
        </div>
      </div>
    </section>
  );
}
export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container">
        <BrandStar />
        <div>
          <h2>جوعان؟ خلّها سوبر.</h2>
          <p>لقمتك الجاية تستاهل.</p>
        </div>
        <Link className="button button-dark" href="/menu">
          اختار وجبتك <ArrowLeft size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
