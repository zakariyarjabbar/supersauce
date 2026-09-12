import type { Metadata, Viewport } from "next";
import "@fontsource-variable/alexandria";
import "./globals.css";
import "@/components/menu-catalog.css";
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
