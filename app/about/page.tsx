import type { Metadata } from "next";
import AboutContent from "./AboutContent";

// 1. SEO Metadata tailored specifically for the About page
export const metadata: Metadata = {
  title: "About Us | History, Vision & Mission",
  description: "Learn about Trans Equality Trust (TET), our leadership under Kasuni Mayadunna, our core values, and our mission to secure legal and social inclusion for transgender individuals in Sri Lanka.",
  keywords: [
    "About Trans Equality Trust",
    "Kasuni Mayadunna TET",
    "Transgender advocacy organization Sri Lanka",
    "TET core values and mission",
  ],
  openGraph: {
    title: "About Us | Trans Equality Trust Sri Lanka",
    description: "Empowering the transgender community through economic opportunities, legislative advocacy, and social support.",
    url: "https://transequalitytrust.lk/about",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Leadership and Team",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Trans Equality Trust",
    description: "Empowering the transgender community through economic opportunities and advocacy.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/about",
  },
};

export default function Page() {
  // 2. Breadcrumb Structured Data (helps Google display breadcrumbs in search results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://transequalitytrust.lk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://transequalitytrust.lk/about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}