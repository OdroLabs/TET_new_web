import type { Metadata } from "next";
import ServicesContent, { type ApiService } from "./ServicesContent";
import { getSettings, getCollection, pageMetadata, text, en, orgLd } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services", "/services");
}

export default async function Page() {
  const [s, services] = await Promise.all([getSettings(), getCollection<ApiService>("services")]);

  // Service-specific Structured Data (Schema.org Service)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": text(s, "seo_services_ld_type"),
    "provider": orgLd(s),
    "areaServed": { "@type": "Country", "name": text(s, "seo_org_country_name") },
    "description": text(s, "seo_services_ld_description"),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": text(s, "seo_services_ld_catalog_name"),
      "itemListElement": (services ?? []).map((svc) => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": en(svc.title), "description": en(svc.description) },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServicesContent initialServices={services} />
    </>
  );
}
