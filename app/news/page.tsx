import type { Metadata } from "next";
import NewsContent, { type ActivityItem } from "./NewsContent";
import { getSettings, getCollection, pageMetadata, text, en, siteUrl, orgLd } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("news", "/news");
}

export default async function Page() {
  const [s, activities] = await Promise.all([getSettings(), getCollection<ActivityItem>("activities")]);

  // Blog / News Listing Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": text(s, "seo_news_ld_name"),
    "description": text(s, "seo_news_ld_description"),
    "url": `${siteUrl(s)}/news`,
    "blogPost": (activities ?? []).map((act) => ({
      "@type": "BlogPosting",
      "headline": en(act.title),
      "description": en(act.excerpt),
      "datePublished": act.date,
      "author": { "@type": "NGO", "name": orgLd(s).name },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsContent initialActivities={activities} />
    </>
  );
}
