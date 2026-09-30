import type { Metadata } from "next";
import VolunteerContent from "./VolunteerContent";
import { getSettings, pageMetadata, text, siteUrl, orgLd } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("volunteer", "/volunteer");
}

export default async function Page() {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": text(s, "seo_volunteer_ld_name"),
    "description": text(s, "seo_volunteer_ld_description"),
    "url": `${siteUrl(s)}/volunteer`,
    "provider": orgLd(s),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VolunteerContent />
    </>
  );
}
