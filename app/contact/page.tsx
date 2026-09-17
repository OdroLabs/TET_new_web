import type { Metadata } from "next";
import ContactContent from "./ContactContent";

// 1. SEO Metadata tailored specifically for Contact & Crisis Desk
export const metadata: Metadata = {
  title: "Contact Us & 24/7 Crisis Hotline | Trans Equality Trust",
  description: "Get in touch with Trans Equality Trust. Access our 24/7 emergency crisis hotline for urgent safety assistance, legal aid, media inquiries, or institutional partnerships in Colombo, Sri Lanka.",
  keywords: [
    "Contact Trans Equality Trust",
    "TET crisis hotline Sri Lanka",
    "Transgender emergency legal aid Colombo",
    "TET office address Sri Lanka",
    "LGBTQ+ support hotline Sri Lanka"
  ],
  openGraph: {
    title: "Contact Us & 24/7 Crisis Hotline | Trans Equality Trust",
    description: "Whether seeking emergency legal aid, institutional partnership, or making an inquiry, our desk is ready.",
    url: "https://transequalitytrust.lk/contact",
    siteName: "Trans Equality Trust",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Trans Equality Trust Contact and Support Desk",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Trans Equality Trust",
    description: "Access our 24/7 emergency crisis hotline and administrative desk.",
  },
  alternates: {
    canonical: "https://transequalitytrust.lk/contact",
  },
};

export default function Page() {
  // 2. ContactPage and Emergency Organization Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Trans Equality Trust",
    "description": "Official communication and 24/7 emergency response channels for Trans Equality Trust.",
    "url": "https://transequalitytrust.lk/contact",
    "mainEntity": {
      "@type": "NGO",
      "name": "Trans Equality Trust",
      "telephone": "+94-11-234-5678",
      "email": "info@transequalitytrust.lk",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Colombo 05",
        "addressCountry": "LK"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+94-11-234-5678",
          "contactType": "Emergency Crisis Support",
          "areaServed": "LK",
          "availableLanguage": ["English", "Sinhala", "Tamil"]
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
      <ContactContent />
    </>
  );
}