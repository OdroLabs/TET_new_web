import type { Metadata } from "next";
import DonateContent from "./DonateContent";
import { getSettings, pageMetadata, text, siteUrl } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("donate", "/donate");
}

export default async function Page() {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": text(s, "seo_donate_ld_name"),
    "description": text(s, "seo_donate_ld_description"),
    "url": `${siteUrl(s)}/donate`,
    "mainEntity": {
      "@type": "NGO",
      "name": text(s, "seo_site_name"),
      "url": siteUrl(s),
      "address": { "@type": "PostalAddress", "addressLocality": text(s, "seo_org_city"), "addressCountry": text(s, "seo_org_country") },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DonateContent />
    </>
  );
}
