import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

// Define type for dynamic events fetched from Laravel
interface ApiEvent {
  id: number;
  title: Record<string, string> | string;
  date: string;
  location: Record<string, string> | string;
  excerpt?: Record<string, string> | string;
  cover_image?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Events & Community Gallery",
    description: "Explore visual archives, national symposiums, peer support retreats, and grassroots community gatherings hosted by Trans Equality Trust across Sri Lanka.",
    keywords: [
      "TET events gallery",
      "Transgender community symposium Sri Lanka",
      "LGBTQ+ events Colombo",
      "Trans Equality Trust photo gallery"
    ],
    openGraph: {
      title: "Events & Community Gallery | Trans Equality Trust",
      description: "Explore ongoing gatherings, workshops, and milestones from across Sri Lanka.",
      url: "https://transequalitytrust.lk/gallery",
      siteName: "Trans Equality Trust",
      images: [
        {
          url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80",
          width: 1200,
          height: 630,
          alt: "Trans Equality Trust Community Gallery",
        },
      ],
      locale: "en_LK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Events & Gallery | Trans Equality Trust",
      description: "Explore visual archives and community gatherings.",
    },
    alternates: {
      canonical: "https://transequalitytrust.lk/gallery",
    },
  };
}

export default async function Page() {
  let events: ApiEvent[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/events`, { next: { revalidate: 60 } });
    if (res.ok) {
      events = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch events for SEO schema:", err);
  }

  // 2. Event Collection Schema with explicit typing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Events & Community Gallery",
    "description": "Visual storytelling and community events documentation by Trans Equality Trust.",
    "url": "https://transequalitytrust.lk/gallery",
    "hasPart": events.map((ev) => {
      const titleText = typeof ev.title === "object" && ev.title !== null
        ? (ev.title.en || Object.values(ev.title)[0])
        : ev.title;
        
      const locationText = typeof ev.location === "object" && ev.location !== null
        ? (ev.location.en || Object.values(ev.location)[0])
        : ev.location;

      return {
        "@type": "Event",
        "name": titleText || "Community Event",
        "startDate": ev.date,
        "location": {
          "@type": "Place",
          "name": locationText || "Sri Lanka"
        },
        "organizer": {
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
      <GalleryContent />
    </>
  );
}