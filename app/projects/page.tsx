import type { Metadata } from "next";
import ProjectsContent from "./ProjectsContent";

// 1. SEO Metadata tailored specifically for Projects
export const metadata: Metadata = {
  title: "Strategic Projects & Advocacy Campaigns",
  description: "Explore TET's strategic initiatives driving systemic change, policy reform, economic empowerment, and emergency housing for the transgender community in Sri Lanka.",
  keywords: [
    "TET projects Sri Lanka",
    "Transgender policy advocacy consortium",
    "Digital literacy employment programs trans youth",
    "Safe spaces crisis aid Sri Lanka",
  ],
  openGraph: {
    title: "Strategic Projects & Campaigns | Trans Equality Trust",
    description: "Driving long-term systemic change, policy evolution, and economic independence.",
    url: "https://transequalitytrust.lk/projects",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Projects and Initiatives",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Projects | Trans Equality Trust",
    description: "Driving systemic change, policy reform, and economic empowerment.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/projects",
  },
};

export default function Page() {
  // 2. Collection / ItemList Schema for Projects
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Strategic Projects",
    "description": "Systemic advocacy campaigns and community development projects by Trans Equality Trust.",
    "url": "https://transequalitytrust.lk/projects",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Sex Work Policy Consortium"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Digital Literacy & Employment Paths"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "TET Safe Spaces & Crisis Aid"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Affirmative Healthcare Access Network"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsContent />
    </>
  );
}