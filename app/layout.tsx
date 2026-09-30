import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider, type SettingsMap } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import PreviewBanner from "./components/PreviewBanner";
import { getSettings, text } from "./lib/cms";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  // Admin → Site Status → "Hide from search engines" (live flag from proxy.ts, settings as fallback)
  const live = (await headers()).get("x-tet-noindex");
  const hidden = live !== null ? live === "1" : text(s, "site_noindex") === "1";
  return {
    title: text(s, "seo_default_title") || undefined,
    description: text(s, "seo_default_description") || undefined,
    robots: hidden ? { index: false, follow: false, googleBot: { index: false, follow: false } } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Load all CMS settings on the server so every page renders its real content immediately
  const settings = await getSettings();
  // Set by proxy.ts when the Coming Soon page is shown: render it on its own, without site chrome
  const requestHeaders = await headers();
  const comingSoon = requestHeaders.get("x-tet-coming-soon") === "1";
  const previewing = requestHeaders.get("x-tet-preview") === "1";

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-gradient-to-br from-sky-50/40 via-white to-pink-50/40 text-slate-800 antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider initialSettings={settings as SettingsMap}>
          {comingSoon ? (
            children
          ) : (
            <>
              <ScrollToTop />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <WhatsAppButton />
            </>
          )}
          {previewing && <PreviewBanner />}
        </LanguageProvider>
      </body>
    </html>
  );
}