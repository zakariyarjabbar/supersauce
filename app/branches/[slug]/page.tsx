import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, MapPin, Clock3, ShoppingBag } from "lucide-react";
import { branches, getBranch, branchMapsUrl } from "@/lib/branches";
import { CtaBand } from "@/components/brand";
import { OrderButton } from "@/components/order-options";
import { pageMetadata, photoShareImage } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return branches.map((b) => ({ slug: b.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const branch = getBranch((await params).slug);
  return branch
    ? pageMetadata({
        path: `/branches/${branch.slug}`,
        title: `فرع ${branch.name}`,
        description: `${branch.city}، ${branch.address}. تعرّف على الخدمات وأوقات العمل وطرق التواصل. بيانات توضيحية لنسخة العرض.`,
        image: photoShareImage("/images/restaurant.webp", "تصوّر توضيحي لواجهة مطعم سوبر صوص"),
      })
    : { title: "الفرع غير موجود" };
}
export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const branch = getBranch((await params).slug);
  if (!branch) notFound();
  return (
    <>
      <div className="container content-page">
        <nav className="breadcrumb" aria-label="مسار التصفح">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/branches">فروعنا</Link>
          <span>/</span>
          <span>{branch.name}</span>
        </nav>
        <section className="branch-detail">
          <div className="branch-detail-copy">
            <span className="location-label">
              <MapPin size={17} />
              {branch.city} / {branch.area}
            </span>
            <h1>
              السوبر،
              <br />
              بـ{branch.name}.
            </h1>
            <p>مكانك للّمة، ووجبتك على مزاجك. مرّ علينا أو جهّز طلبك قبل الطلعة.</p>
            <dl className="branch-info-list">
              <div>
                <dt>
                  <MapPin size={19} /> العنوان
                </dt>
                <dd>{branch.address}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 size={19} /> وقت السوبر
                </dt>
                <dd>{branch.hours}</dd>
              </div>
              <div>
                <dt>
                  <ShoppingBag size={19} /> شنو متوفر؟
                </dt>
                <dd>{branch.services.join(" · ")}</dd>
              </div>
            </dl>
            <div className="action-row">
              <OrderButton branchName={branch.name}>اطلب من هذا الفرع</OrderButton>
              <a
                className="button button-outline"
                href={branchMapsUrl(branch)}
                target="_blank"
                rel="noopener noreferrer"
              >
                ابحث بالخريطة <ArrowUpLeft size={19} />
              </a>
            </div>
            <p className="small-note">
              بيانات الفرع والصورة تصوّر توضيحي لنسخة العرض، وليست معلومات زيارة معتمدة.
            </p>
          </div>
          <figure className="branch-detail-photo">
            <Image
              src="/images/restaurant.webp"
              alt="تصوّر معماري لمطعم سوبر صوص بواجهة حمراء وإضاءة دافئة"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <figcaption>تصوّر بصري للمكان</figcaption>
          </figure>
        </section>
        <div className="inline-help">
          <h2>أول زيارة؟ حياك.</h2>
          <p>شوف المنيو واختار وجبتك قبل ما توصل. ولأي سؤال عن الوصول أو الخدمات، تواصل ويانا.</p>
          <Link className="text-link" href="/contact">
            نسمعك <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
