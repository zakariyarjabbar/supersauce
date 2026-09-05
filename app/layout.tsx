import type { Metadata, Viewport } from "next";
import "@fontsource-variable/alexandria";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: "سوبر صوص | مو بس برغر، هذا سوبر", template: "%s | سوبر صوص" },
  description: site.description,
  applicationName: "سوبر صوص",
  robots: site.demo ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ar_IQ",
    siteName: "سوبر صوص",
    title: "سوبر صوص | مو بس برغر، هذا سوبر",
    description: site.description,
    images: [{ url: "/images/hero-burger.webp", width: 1536, height: 1024, alt: "برغر سوبر صوص" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سوبر صوص | مو بس برغر، هذا سوبر",
    description: site.description,
    images: ["/images/hero-burger.webp"],
  },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#ce1725", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar-IQ" dir="rtl">
      <body>
        <span
          hidden
          dangerouslySetInnerHTML={{
            __html:
              "<!-- THESIS: The Iraqi red restaurant campaign becomes a food-first website. OWN-WORLD: saturated red, butter yellow stars, cream paper, Alexandria Arabic, checkerboard seams. STORY: crave a burger, explore the menu, build a demo meal, find the brand. FIRST VIEWPORT: cream navigation, enormous right-hand Arabic headline, left-hand sculptural burger, yellow action and star stamp. FORM: reference-pinned brand campaign, seed fe71bef7; user delegated mock content. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->",
          }}
        />
        <a href="#main" className="skip-link">
          انتقل إلى المحتوى
        </a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
