import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

// 1. SEO Metadata tailored specifically for Services
export const metadata: Metadata = {
  title: "Our Services | Legal Aid, Healthcare & Crisis Support",
  description: "Explore TET's essential services including 24/7 legal defense, affirmative medical healthcare access, trauma-informed counseling, and emergency crisis intervention for the transgender community in Sri Lanka.",
  keywords: [
    "Transgender healthcare Sri Lanka",
    "Legal aid for trans community",
    "Mental health counseling Colombo",
    "Emergency crisis intervention TET",
    "Transgender support services Sri Lanka"
  ],
  openGraph: {
    title: "Our Services | Trans Equality Trust",
    description: "Comprehensive support infrastructure: legal defense, clinical care, safe housing, and emergency response.",
    url: "https://transequalitytrust.lk/services",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Support Services",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | Trans Equality Trust",
    description: "Legal defense, healthcare access, and emergency crisis support.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/services",
  },
};

export default function Page() {
  // 2. Service-specific Structured Data (Schema.org Service)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Transgender Community Advocacy, Legal Aid, and Healthcare Support",
    "provider": {
      "@type": "NGO",
      "name": "Trans Equality Trust",
      "url": "https://transequalitytrust.lk"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Sri Lanka"
    },
    "description": "Providing 24/7 legal aid, clinical healthcare access, mental health counseling, and crisis intervention."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesContent />
    </>
  );
}