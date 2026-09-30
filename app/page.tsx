import type { Metadata } from "next";
import HomeContent from "./HomeContent";
import { getSettings, pageMetadata, text, siteUrl } from "./lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home", "");
}

export default async function Page() {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": text(s, "seo_site_name"),
    "alternateName": text(s, "seo_org_alt_name"),
    "url": siteUrl(s),
    "logo": text(s, "seo_org_logo_url"),
    "description": text(s, "seo_org_description"),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": text(s, "seo_org_locality"),
      "addressCountry": text(s, "seo_org_country"),
    },
    "sameAs": [text(s, "footer_fb_url")].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeContent />
    </>
  );
}
