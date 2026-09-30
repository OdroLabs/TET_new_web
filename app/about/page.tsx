import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import { getSettings, pageMetadata, text, siteUrl } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about", "/about");
}

export default async function Page() {
  const s = await getSettings();
  // Breadcrumb Structured Data (helps Google display breadcrumbs in search results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": text(s, "seo_breadcrumb_home"), "item": siteUrl(s) },
      { "@type": "ListItem", "position": 2, "name": text(s, "seo_about_breadcrumb"), "item": `${siteUrl(s)}/about` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutContent />
    </>
  );
}
