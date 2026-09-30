import type { Metadata } from "next";
import ProjectsContent, { type ApiProject } from "./ProjectsContent";
import { getSettings, getCollection, pageMetadata, text, en, siteUrl } from "../lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("projects", "/projects");
}

export default async function Page() {
  const [s, projects] = await Promise.all([getSettings(), getCollection<ApiProject>("projects")]);

  // Collection / ItemList Schema for Projects
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": text(s, "seo_projects_ld_name"),
    "description": text(s, "seo_projects_ld_description"),
    "url": `${siteUrl(s)}/projects`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (projects ?? []).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": `${en(p.title1)} ${en(p.title2)}`.trim(),
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectsContent initialProjects={projects} />
    </>
  );
}
