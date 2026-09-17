import type { Metadata } from "next";
import BookingContent from "./BookingContent";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

interface ApiProduct {
  id: number;
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  price: number;
  currency: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Social Enterprise | Hall Booking, Daily Care & Wellness Products",
    description: "Support TET's community mission. Book our inclusive event spaces, reserve daily care center services, or order certified, discreetly packaged safe-sex wellness products.",
    keywords: [
      "TET social enterprise Sri Lanka",
      "Event hall booking Colombo",
      "Daily care center services",
      "Buy condoms online Sri Lanka TET",
      "Community wellness kits"
    ],
    openGraph: {
      title: "Social Enterprise | Trans Equality Trust",
      description: "100% of proceeds generated from hall bookings, daily care, and product sales fund community protection missions.",
      url: "https://transequalitytrust.lk/booking",
      siteName: "Trans Equality Trust",
      images: [
        {
          url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
          width: 1200,
          height: 630,
          alt: "TET Social Enterprise & Venue Booking",
        },
      ],
      locale: "en_LK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Social Enterprise | Trans Equality Trust",
      description: "Hall bookings, daily care center, and safe wellness products.",
    },
    alternates: {
      canonical: "https://transequalitytrust.lk/booking",
    },
  };
}

export default async function Page() {
  let products: ApiProduct[] = [];
  try {
    const res = await fetch(`${API_BASE}/api/products`, { next: { revalidate: 60 } });
    if (res.ok) {
      products = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch products for SEO schema:", err);
  }

  // Schema for Local Business / Products offered by the Social Enterprise
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TET Social Enterprises",
    "description": "Purpose-driven businesses funding community safety missions, hall rentals, and wellness products.",
    "url": "https://transequalitytrust.lk/booking",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Colombo",
      "addressCountry": "LK"
    },
    "makesOffer": products.map((prod) => {
      const titleText = typeof prod.title === "object" && prod.title !== null
        ? (prod.title.en || Object.values(prod.title)[0])
        : prod.title;

      const descText = typeof prod.description === "object" && prod.description !== null
        ? (prod.description.en || Object.values(prod.description)[0])
        : prod.description;

      return {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": titleText || "Wellness Product",
          "description": descText || ""
        },
        "price": prod.price,
        "priceCurrency": prod.currency || "LKR"
      };
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookingContent />
    </>
  );
}