import type { Metadata } from "next";
import GalleryContent, { type EventItem } from "./GalleryContent";
import { getSettings, getCollection, pageMetadata, text, en, siteUrl, orgLd } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("gallery", "/gallery");
}

export default async function Page() {
  const [s, events] = await Promise.all([getSettings(), getCollection<EventItem>("events")]);

  // Event Collection Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": text(s, "seo_gallery_ld_name"),
    "description": text(s, "seo_gallery_ld_description"),
    "url": `${siteUrl(s)}/gallery`,
    "hasPart": (events ?? []).map((ev) => ({
      "@type": "Event",
      "name": en(ev.title),
      "startDate": ev.date,
      "location": { "@type": "Place", "name": en(ev.location) || text(s, "seo_org_country_name") },
      "organizer": { "@type": "NGO", "name": orgLd(s).name },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GalleryContent initialEvents={events} />
    </>
  );
}
