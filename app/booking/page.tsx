import type { Metadata } from "next";
import BookingContent, { type ProductItem } from "./BookingContent";
import { getSettings, getCollection, pageMetadata, text, en, siteUrl } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("booking", "/booking");
}

export default async function Page() {
  const [s, products] = await Promise.all([getSettings(), getCollection<ProductItem>("products")]);

  // Schema for Local Business / Products offered by the Social Enterprise
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": text(s, "seo_booking_ld_name"),
    "description": text(s, "seo_booking_ld_description"),
    "url": `${siteUrl(s)}/booking`,
    "address": { "@type": "PostalAddress", "addressLocality": text(s, "seo_org_city"), "addressCountry": text(s, "seo_org_country") },
    "makesOffer": (products ?? []).map((prod) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Product", "name": en(prod.title), "description": en(prod.description) },
      "price": prod.price,
      "priceCurrency": prod.currency,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookingContent initialProducts={products} />
    </>
  );
}
