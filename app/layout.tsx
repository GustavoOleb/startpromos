import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionRoot from "@/components/MotionRoot";
import PurchaseToasts from "@/components/PurchaseToasts";
import { getPublicNavItemsFromProducts, getPublishedProductsLive } from "@/lib/products";
import { SITE } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    siteName: SITE.name,
    locale: "pt_BR",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/starticon.png", apple: "/starticon.png" },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/ofertas?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const toastProducts = await getPublishedProductsLive();
  const navItems = getPublicNavItemsFromProducts(toastProducts);

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${archivo.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-void font-body text-fog">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#conteudo" className="skip-link">
          Ir para o conteúdo
        </a>
        <MotionRoot>
          <Header navItems={navItems} />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <PurchaseToasts products={toastProducts} />
          <Footer navItems={navItems} />
        </MotionRoot>
      </body>
    </html>
  );
}
