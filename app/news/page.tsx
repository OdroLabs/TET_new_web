import type { Metadata } from "next";
import NewsContent from "./NewsContent";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

interface ApiActivity {
  id: number;
  title: Record<string, string> | string;
  date: string;
  location: Record<string, string> | string;
  excerpt: Record<string, string> | string;
  img?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Daily Activities & Field Reports",
    description: "Read real-time updates, field visits, community support sessions, and grassroots interventions happening across Sri Lanka by Trans Equality Trust.",
    keywords: [
      "TET news and activities",
      "Transgender community field reports Sri Lanka",
      "Grassroots advocacy updates Colombo",
      "Trans Equality Trust blog"
    ],
    openGraph: {
      title: "Daily Activities & Field Reports | Trans Equality Trust",
      description: "Real-time updates, field visits, and community support sessions across Sri Lanka.",
      url: "https://transequalitytrust.lk/news",
      siteName: "Trans Equality Trust",
      images: [
        {
          url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80",
          width: 1200,
          height: 630,
          alt: "Trans Equality Trust Field Activities",
        },
      ],
      locale: "en_LK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Daily Activities | Trans Equality Trust",
      description: "Real-time field updates and community interventions.",
    },
    alternates: {
      canonical: "https://transequalitytrust.lk/news",
    },
  };
}

export default async function Page() {
  let activities: ApiActivity[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/activities`, { next: { revalidate: 60 } });
    if (res.ok) {
      activities = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch activities for SEO schema:", err);
  }

  // Blog / News Listing Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TET Daily Activities & Field Reports",
    "description": "Real-time field updates and grassroots interventions by Trans Equality Trust.",
    "url": "https://transequalitytrust.lk/news",
    "blogPost": activities.map((act) => {
      const titleText = typeof act.title === "object" && act.title !== null
        ? (act.title.en || Object.values(act.title)[0])
        : act.title;

      const excerptText = typeof act.excerpt === "object" && act.excerpt !== null
        ? (act.excerpt.en || Object.values(act.excerpt)[0])
        : act.excerpt;

      return {
        "@type": "BlogPosting",
        "headline": titleText || "Field Update",
        "description": excerptText || "",
        "datePublished": act.date,
        "author": {
          "@type": "NGO",
          "name": "Trans Equality Trust"
        }
      };
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsContent />
    </>
  );
}