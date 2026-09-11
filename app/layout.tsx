import type { Metadata, Viewport } from "next";
import "@fontsource-variable/alexandria";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrderProvider } from "@/components/order-options";
import { site } from "@/lib/site";
import { homeTitle, pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ path: "/" }),
  metadataBase: new URL(site.origin),
  title: { default: homeTitle, template: "%s | سوبر صوص" },
  applicationName: "سوبر صوص",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
              "<!-- THESIS: The Iraqi red restaurant campaign becomes a food-first website. OWN-WORLD: saturated red, butter yellow stars, cream paper, Alexandria Arabic, checkerboard seams. STORY: crave a burger, explore the menu, choose a contact channel, find the brand. FIRST VIEWPORT: cream navigation, enormous right-hand Arabic headline, left-hand sculptural burger, yellow action and star stamp. FORM: reference-pinned brand campaign, seed fe71bef7; user delegated mock content. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->" +
              "<!-- BRANCH-MAP: THESIS: Iraq's geography makes branch discovery tangible. OWN-WORLD: inherit Super Sauce red, cream, yellow selected pins, Alexandria Arabic, and checkerboard seam. STORY: locate, select, inspect, open directions or contact. FIRST VIEWPORT: right-hand branch panel, larger left-hand map, search and province chips above; phone selection opens a bottom sheet. FORM: user-approved side-panel and mobile-sheet concepts; local extension, no new seed. Sample locations are labelled and editable. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->",
          }}
        />
        <a href="#main" className="skip-link">
          انتقل إلى المحتوى
        </a>
        <OrderProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </OrderProvider>
      </body>
    </html>
  );
}
