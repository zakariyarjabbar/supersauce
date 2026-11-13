import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./site-shell.module.css";

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={footer ? styles.footerLogo : styles.logo}
      aria-label="سوبر صوص — الرئيسية"
    >
      <Image
        src="/images/brand/super-sauce-light.svg"
        alt=""
        width={720}
        height={415}
        loading={footer ? "lazy" : "eager"}
        unoptimized
      />
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
        d="M44 7Q50-3 56 7L68 25Q70 28 74 29L94 34Q103 36 96 44L82 61Q79 64 79 68L80 88Q81 98 72 95L53 88Q50 87 47 88L28 95Q19 98 20 88L21 68Q21 64 18 61L4 44Q-3 36 6 34L26 29Q30 28 32 25Z"
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
