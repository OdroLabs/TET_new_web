import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import { getSettings, pageMetadata, text, list, siteUrl } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact", "/contact");
}

export default async function Page() {
  const s = await getSettings();
  const phone = text(s, "seo_org_phone");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": text(s, "seo_contact_ld_name"),
    "description": text(s, "seo_contact_ld_description"),
    "url": `${siteUrl(s)}/contact`,
    "mainEntity": {
      "@type": "NGO",
      "name": text(s, "seo_site_name"),
      "telephone": phone,
      "email": text(s, "seo_org_email"),
      "address": { "@type": "PostalAddress", "addressLocality": text(s, "seo_org_locality"), "addressCountry": text(s, "seo_org_country") },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": phone,
          "contactType": text(s, "seo_contact_ld_type"),
          "areaServed": text(s, "seo_org_country"),
          "availableLanguage": list(s, "seo_languages"),
        },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactContent />
    </>
  );
}
