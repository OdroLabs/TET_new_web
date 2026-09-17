import type { Metadata } from "next";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Trans Equality Trust (TET) | Protecting Transgender Rights in Sri Lanka",
  description: "Dedicated to protecting the safety, legal rights, and well-being of over 5,000 transgender individuals in Sri Lanka through systemic advocacy, crisis aid, and social enterprise.",
  keywords: [
    "Transgender rights Sri Lanka",
    "Trans Equality Trust",
    "TET Sri Lanka",
    "LGBTQ+ support Colombo",
    "Legal aid for trans community",
  ],
  openGraph: {
    title: "Trans Equality Trust (TET) | Sri Lanka",
    description: "Protecting the rights, safety, and well-being of the transgender community through advocacy and support.",
    url: "https://transequalitytrust.lk",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Advocacy",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trans Equality Trust (TET) | Sri Lanka",
    description: "Protecting the rights, safety, and well-being of the transgender community.",
    images: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"],
  },
  alternates: {
    canonical: "https://transequalitytrust.lk",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Trans Equality Trust",
    "alternateName": "TET Sri Lanka",
    "url": "https://transequalitytrust.lk",
    "logo": "https://transequalitytrust.lk/logo.png",
    "description": "Protecting the rights, safety, and well-being of the transgender community in Sri Lanka.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Colombo 05",
      "addressCountry": "LK"
    },
    "sameAs": [
      "https://www.facebook.com/share/12G6Xq5jZ15/"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}